/**
 * Fetch a Raindrop.io collection and write it to _data/bookmarks.json.
 *
 * Runs in CI only. The Eleventy build reads the committed JSON snapshot and
 * never talks to Raindrop, so a Raindrop outage cannot break a deploy or the
 * live site.
 *
 * Usage:
 *   RAINDROP_TOKEN=xxx RAINDROP_COLLECTION_ID=nnn node scripts/fetch-bookmarks.js
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Overridable so the fetch loop can be exercised against a local mock.
const API = process.env.RAINDROP_API ?? "https://api.raindrop.io/rest/v1";
const PER_PAGE = 50; // Raindrop's maximum.
const OUTPUT = fileURLToPath(
  new URL("../_data/bookmarks.json", import.meta.url),
);

/**
 * Guard against a partial fetch silently truncating the committed archive.
 * A real collection shrinks slowly; a sudden drop means something went wrong
 * upstream and we would rather fail loudly than commit a gutted file.
 *
 * This only applies once a snapshot exists. An empty collection is a valid
 * starting state, so the first run is free to write an empty array.
 */
const MAX_SHRINK = 0.2;

/**
 * Display dates are formatted here, not in the template, so output does not
 * depend on the build machine's clock. Liquid's date filter renders in local
 * time, which would put a UTC-midnight bookmark on different days depending on
 * whether the build ran on a laptop in New York or a UTC runner in CI.
 *
 * Matches site.timezone in _data/site.json.
 */
const DISPLAY_TIMEZONE = "America/New_York";

/**
 * HTML4 named entities for U+00A0-U+00FF, in code point order. Scraped metadata
 * from European sites leans on these heavily (&auml;, &eacute;, &ccedil;).
 */
const LATIN1 =
  "nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml yacute thorn yuml";

/**
 * Named entities that turn up in scraped page metadata. Numeric entities are
 * handled generically below, and anything outside both sets is left alone
 * rather than mangled.
 *
 * Lookup is case sensitive because HTML entities are: &Auml; and &auml; are
 * different characters.
 */
const ENTITIES = {
  ...Object.fromEntries(
    LATIN1.split(" ").map((name, index) => [
      name,
      String.fromCodePoint(0xa0 + index),
    ]),
  ),
  amp: "&",
  apos: "'",
  bull: "•",
  gt: ">",
  hellip: "…",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  mdash: "—",
  ndash: "–",
  quot: '"',
  rdquo: "”",
  rsquo: "’",
  trade: "™",
};

/**
 * Raindrop scrapes titles and excerpts from page metadata, so they arrive with
 * markup and encoded entities in them. Reduce each to plain text once, here,
 * rather than trusting every downstream template to escape correctly.
 */
function toPlainText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return (
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
        String.fromCodePoint(Number.parseInt(code, 16)),
      )
      .replace(
        /&([a-z0-9]+);/gi,
        (match, name) =>
          ENTITIES[name] ?? ENTITIES[name.toLowerCase()] ?? match,
      )
      .replace(/\s+/g, " ")
      // Stripping an inline tag leaves a gap in front of any punctuation that
      // followed it, e.g. "Tags <b>stripped</b>, decoded" -> "Tags stripped ,".
      .replace(/\s+([,.;:!?)\]])/g, "$1")
      .replace(/([([])\s+/g, "$1")
      .trim()
  );
}

async function fetchPage(collectionId, token, page) {
  const url = new URL(`${API}/raindrops/${collectionId}`);
  url.searchParams.set("perpage", String(PER_PAGE));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", "-created");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Raindrop returned ${response.status} ${response.statusText} for page ${page}.`,
    );
  }

  const body = await response.json();

  if (!body.result || !Array.isArray(body.items)) {
    throw new Error(
      `Unexpected Raindrop response for page ${page}: ${JSON.stringify(body).slice(0, 200)}`,
    );
  }

  return body.items;
}

function displayDate(iso) {
  const parsed = new Date(iso);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    timeZone: DISPLAY_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Covers are deliberately dropped. They are Raindrop CDN URLs that rot, and
 * rendering them would hotlink hundreds of third-party images onto the site.
 */
function normalize(item) {
  return {
    id: item._id,
    title: toPlainText(item.title),
    link: item.link,
    excerpt: toPlainText(item.excerpt),
    note: toPlainText(item.note),
    domain: item.domain ?? "",
    tags: Array.isArray(item.tags) ? [...item.tags].sort() : [],
    type: item.type ?? "link",
    created: item.created,
    date: displayDate(item.created),
  };
}

async function countExisting() {
  try {
    const existing = JSON.parse(await readFile(OUTPUT, "utf8"));
    return Array.isArray(existing) ? existing.length : 0;
  } catch {
    return 0;
  }
}

function validate(bookmarks, previousCount) {
  const incomplete = bookmarks.filter((entry) => !entry.link || !entry.title);

  if (incomplete.length > 0) {
    throw new Error(
      `Refusing to write: ${incomplete.length} bookmark(s) are missing a link or title.`,
    );
  }

  const floor = Math.floor(previousCount * (1 - MAX_SHRINK));

  if (previousCount > 0 && bookmarks.length < floor) {
    throw new Error(
      `Refusing to write: bookmark count dropped from ${previousCount} to ${bookmarks.length}, ` +
        `below the ${floor} floor. Re-run once Raindrop is healthy, or delete _data/bookmarks.json ` +
        `if the collection really was pruned.`,
    );
  }
}

async function main() {
  const token = process.env.RAINDROP_TOKEN;
  const collectionId = process.env.RAINDROP_COLLECTION_ID;

  if (!token) {
    throw new Error("RAINDROP_TOKEN is not set.");
  }

  if (!collectionId) {
    throw new Error("RAINDROP_COLLECTION_ID is not set.");
  }

  const bookmarks = [];

  for (let page = 0; ; page += 1) {
    const items = await fetchPage(collectionId, token, page);
    bookmarks.push(...items.map(normalize));

    if (items.length < PER_PAGE) {
      break;
    }
  }

  // Sort here rather than trusting the API's order, so an unchanged collection
  // always serializes identically and the daily commit diff stays meaningful.
  bookmarks.sort(
    (a, b) => Date.parse(b.created) - Date.parse(a.created) || b.id - a.id,
  );

  const previousCount = await countExisting();
  validate(bookmarks, previousCount);

  await writeFile(OUTPUT, `${JSON.stringify(bookmarks, null, 2)}\n`);
  console.log(
    `Wrote ${bookmarks.length} bookmarks to _data/bookmarks.json (was ${previousCount}).`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
