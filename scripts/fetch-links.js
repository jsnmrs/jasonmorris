/**
 * Fetch a Raindrop.io collection and write it to _data/links.json.
 *
 * Runs in CI only. The Eleventy build reads the committed JSON snapshot and
 * never talks to Raindrop, so a Raindrop outage cannot break a deploy or the
 * live site.
 *
 * Usage:
 *   RAINDROP_TOKEN=xxx RAINDROP_COLLECTION_ID=nnn node scripts/fetch-links.js
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Overridable so the fetch loop can be exercised against a local mock.
const API = process.env.RAINDROP_API ?? "https://api.raindrop.io/rest/v1";
const PER_PAGE = 50; // Raindrop's maximum.
const OUTPUT = fileURLToPath(new URL("../_data/links.json", import.meta.url));

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
 * Hosts whose videos the site can embed. This list is deliberately the same
 * shape as frame-src in .htaccess: anything not listed here stays a plain link
 * rather than becoming an iframe the browser would refuse to load.
 *
 * Raindrop's own `type: "video"` is not enough to go on. It also covers TikTok
 * and Instagram, which have no embed here, so the URL is the source of truth.
 */
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

const YOUTUBE_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d+$/;

/** YouTube paths that carry the video id in the segment after the prefix. */
const YOUTUBE_ID_PREFIXES = new Set(["embed", "shorts", "live", "v"]);

/**
 * hqdefault is the only YouTube thumbnail guaranteed to exist for every video.
 * maxresdefault is a true 16:9 crop at a better resolution but 404s on plenty
 * of videos, and a poster that sometimes fails is worse than one that never
 * does. hqdefault is 4:3 with pillarbox bars; links.css crops it back.
 */
const YOUTUBE_POSTER_WIDTH = 480;
const YOUTUBE_POSTER_HEIGHT = 360;

const VIMEO_OEMBED = "https://vimeo.com/api/oembed.json";
const VIMEO_POSTER_HOST = "i.vimeocdn.com";

/**
 * oEmbed sizes the thumbnail to the player width it is asked for, and its
 * default is a 295x166 postage stamp. Asking for the width the facade actually
 * renders at returns a 640x360 crop instead, which is both larger and a true
 * 16:9 rather than YouTube's pillarboxed 4:3.
 */
const VIMEO_POSTER_REQUEST_WIDTH = 800;

/**
 * Display dates are formatted here, not in the template, so output does not
 * depend on the build machine's clock. Liquid's date filter renders in local
 * time, which would put a UTC-midnight link on different days depending on
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

/**
 * Highlights are pulled out of page bodies, so unlike a title or an excerpt
 * they carry real paragraph breaks. Split on blank lines before reducing each
 * block, or toPlainText's whitespace collapsing would run several paragraphs
 * together into one wall of text.
 */
function toPlainTextBlocks(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\n\s*\n/)
    .map(toPlainText)
    .filter(Boolean);
}

function youtubeId(url) {
  if (url.hostname.endsWith("youtu.be")) {
    return url.pathname.split("/").filter(Boolean)[0] ?? "";
  }

  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] === "watch") {
    return url.searchParams.get("v") ?? "";
  }

  return YOUTUBE_ID_PREFIXES.has(segments[0]) ? (segments[1] ?? "") : "";
}

/**
 * Only the URL shapes whose id sits in a known position. vimeo.com/123/abc123
 * is an unlisted video whose trailing hash the embed also needs, so it is left
 * out: a plain link is a better outcome than an embed that fails to play.
 */
function vimeoId(url) {
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] === "video") {
    return segments[1] ?? "";
  }

  if (segments[0] === "channels") {
    return segments[2] ?? "";
  }

  if (segments[0] === "groups" && segments[2] === "videos") {
    return segments[3] ?? "";
  }

  return segments.length === 1 ? segments[0] : "";
}

/**
 * Map a saved link to an embeddable video, or null. Both ids are validated
 * against their known shape, so an unrecognized URL degrades to a plain link
 * instead of producing an iframe pointed at nothing.
 */
function parseVideo(link) {
  let url;

  try {
    url = new URL(link);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return null;
  }

  const host = url.hostname.toLowerCase();

  if (YOUTUBE_HOSTS.has(host)) {
    const id = youtubeId(url);
    return YOUTUBE_ID.test(id) ? { type: "youtube", id } : null;
  }

  if (VIMEO_HOSTS.has(host)) {
    const id = vimeoId(url);
    return VIMEO_ID.test(id) ? { type: "vimeo", id } : null;
  }

  return null;
}

/**
 * YouTube derives a poster from the video id alone, so it costs nothing. Vimeo
 * hides its thumbnails behind opaque i.vimeocdn.com hashes that only the oEmbed
 * API can resolve, so those are filled in later by resolveVimeoPosters.
 */
function videoFor(link) {
  const video = parseVideo(link);

  if (!video) {
    return null;
  }

  if (video.type === "youtube") {
    return {
      ...video,
      poster: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      posterWidth: YOUTUBE_POSTER_WIDTH,
      posterHeight: YOUTUBE_POSTER_HEIGHT,
    };
  }

  return { ...video, poster: null, posterWidth: null, posterHeight: null };
}

/**
 * Colour and id are dropped: neither is rendered, and colour would only add
 * noise to the nightly diff. Raindrop's order is preserved so the first
 * highlight the template shows inline stays the same between runs.
 */
function toHighlights(highlights) {
  if (!Array.isArray(highlights)) {
    return [];
  }

  return highlights
    .map((highlight) => ({
      text: toPlainTextBlocks(highlight?.text),
      note: toPlainText(highlight?.note),
    }))
    .filter((highlight) => highlight.text.length > 0);
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
    video: videoFor(item.link),
    highlights: toHighlights(item.highlights),
    created: item.created,
    date: displayDate(item.created),
  };
}

async function readExisting() {
  try {
    const existing = JSON.parse(await readFile(OUTPUT, "utf8"));
    return Array.isArray(existing) ? existing : [];
  } catch {
    return [];
  }
}

async function fetchVimeoPoster(link) {
  const url = new URL(VIMEO_OEMBED);
  url.searchParams.set("url", link);
  url.searchParams.set("width", String(VIMEO_POSTER_REQUEST_WIDTH));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const body = await response.json();
  const poster = new URL(body.thumbnail_url);

  // A redirect must not be able to smuggle a host past the site's img-src.
  if (poster.hostname !== VIMEO_POSTER_HOST) {
    throw new Error(`unexpected thumbnail host ${poster.hostname}`);
  }

  return {
    poster: poster.href,
    posterWidth: Number(body.thumbnail_width) || null,
    posterHeight: Number(body.thumbnail_height) || null,
  };
}

/**
 * Fill in Vimeo posters, reusing whatever the last snapshot already resolved.
 *
 * Each unseen video costs an oEmbed request, so carrying resolved posters
 * forward keeps the nightly job off Vimeo's API for videos already in the
 * archive and keeps the committed diff to what actually changed.
 *
 * A failure here is not fatal. The page falls back to a poster-less facade
 * that still plays, which beats refusing to write the whole snapshot because
 * Vimeo was briefly unreachable.
 */
async function resolveVimeoPosters(links, previous) {
  const seen = new Map(previous.map((entry) => [entry.id, entry]));

  for (const entry of links) {
    if (entry.video?.type !== "vimeo") {
      continue;
    }

    const cached = seen.get(entry.id)?.video;

    if (cached?.poster) {
      entry.video.poster = cached.poster;
      entry.video.posterWidth = cached.posterWidth;
      entry.video.posterHeight = cached.posterHeight;
      continue;
    }

    try {
      Object.assign(entry.video, await fetchVimeoPoster(entry.link));
    } catch (error) {
      console.warn(
        `Could not resolve a Vimeo poster for ${entry.link}: ${error.message}`,
      );
    }
  }
}

function validate(links, previousCount) {
  const incomplete = links.filter((entry) => !entry.link || !entry.title);

  if (incomplete.length > 0) {
    throw new Error(
      `Refusing to write: ${incomplete.length} link(s) are missing a link or title.`,
    );
  }

  const floor = Math.floor(previousCount * (1 - MAX_SHRINK));

  if (previousCount > 0 && links.length < floor) {
    throw new Error(
      `Refusing to write: link count dropped from ${previousCount} to ${links.length}, ` +
        `below the ${floor} floor. Re-run once Raindrop is healthy, or delete _data/links.json ` +
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

  const links = [];

  for (let page = 0; ; page += 1) {
    const items = await fetchPage(collectionId, token, page);
    links.push(...items.map(normalize));

    if (items.length < PER_PAGE) {
      break;
    }
  }

  // Sort here rather than trusting the API's order, so an unchanged collection
  // always serializes identically and the daily commit diff stays meaningful.
  links.sort(
    (a, b) => Date.parse(b.created) - Date.parse(a.created) || b.id - a.id,
  );

  const previous = await readExisting();
  await resolveVimeoPosters(links, previous);
  validate(links, previous.length);

  await writeFile(OUTPUT, `${JSON.stringify(links, null, 2)}\n`);
  console.log(
    `Wrote ${links.length} links to _data/links.json (was ${previous.length}).`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
