import path from "path";
import Image from "@11ty/eleventy-img";
import pluginGitCommitDate from "eleventy-plugin-git-commit-date";
import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

// Configuration Constants
const LAYOUT_ALIASES = {
  audiograph: "layouts/audiograph.html",
  doc: "layouts/doc.html",
  home: "layouts/home.html",
  page: "layouts/page.html",
  post: "layouts/post.html",
  tag: "layouts/tag.html",
};

const STATIC_ASSETS = [
  "fonts",
  "img",
  "css",
  "favicon.ico",
  "favicon.svg",
  "jason-morris-resume.pdf",
  "manifest.webmanifest",
  "apple-touch-icon.png",
  "apple-touch-icon-192.png",
  "apple-touch-icon-512.png",
  "robots.txt",
  "rss.xsl",
  "sitemap.xsl",
  ".htaccess",
];

const MEDIA_BREAKPOINTS = {
  mobile: {
    width: 320,
    media: "(max-width: 320px)",
  },
  tablet: {
    width: 800,
    media: "(max-width: 800px)",
  },
  desktop: {
    width: 1024,
    media: "(min-width: 801px)",
  },
  wide: {
    width: 1600,
    media: "(min-width: 1025px)",
  },
};

const IMAGE_FORMATS = ["avif", "webp", "jpeg"];

// Utility Functions
/**
 * Safely processes an image with error handling
 * @param {string} fileName - Path to the image file
 * @param {number[]} widths - Array of widths to generate
 * @param {string[]} formats - Array of formats to generate
 * @param {string} outputDir - Output directory for processed images
 * @returns {Promise<Object|null>} - Image metadata or null if processing fails
 */
const safeImageProcess = async (
  fileName,
  widths,
  formats,
  outputDir = "./img/",
) => {
  try {
    return await Image(fileName, {
      widths,
      formats,
      outputDir,
      filenameFormat: (id, src, width, format) => {
        const extension = path.extname(src);
        let outExt = format === "jpeg" ? "jpg" : format;
        const name = path.basename(src, extension);
        return `${name}-${width}.${outExt}`;
      },
    });
  } catch (error) {
    console.error(`Failed to process image: ${error.message}`);
    return null;
  }
};

/**
 * Generates source sets for different image formats and sizes
 * @param {string} fullPath - Base path to the image
 * @param {Array<{width: number, media: string}>} sizes - Array of size configurations
 * @param {string[]} formats - Array of image formats
 * @returns {Object} - Object containing source sets for each format
 */
const generateSourcesets = (fullPath, sizes, formats) => {
  const sources = {};
  formats.forEach((format) => {
    sources[format] = sizes
      .map(
        (size) =>
          `<source media="${size.media}" srcset="${fullPath}-${size.width}.${format === "jpeg" ? "jpg" : format}" ${format !== "jpeg" ? `type="image/${format}"` : ""}>`,
      )
      .join("\n");
  });
  return sources;
};

/**
 * Escapes text for safe interpolation into HTML markup
 * @param {string} value - Raw text
 * @returns {string} - Escaped text
 */
const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/**
 * Creates a picture element with optional caption
 * @param {Object} sources - Source sets for different formats
 * @param {string} imgSrc - Default image source
 * @param {string} alt - Alt text
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} [caption] - Optional caption
 * @returns {string} - HTML string for picture element
 */
const createPictureElement = (sources, imgSrc, alt, width, height, caption) => {
  const picture = `
    <picture>
      ${Object.values(sources).join("\n")}
      <img
        src="${imgSrc}"
        alt="${escapeHtml(alt)}"
        loading="lazy"
        width="${width}"
        height="${height}"
      >
    </picture>
  `.trim();

  return caption
    ? `<figure>${picture}<figcaption>${escapeHtml(caption)}</figcaption></figure>`
    : picture;
};

/**
 * Hand-written accessible names for every code block on the site, keyed
 * by the block's first line of code. A new or edited code block whose
 * first line has no entry here fails the build until a label is added.
 */
const CODE_BLOCK_LABELS = {
  "cp -a ~/.ssh ~/ssh-backup": "Back up the SSH directory",
  'ssh-keygen -t rsa -b 4096 ~/.ssh/id_rsa -C "comment"':
    "Generate a new SSH key",
  "chmod 600 ~/.ssh/id_rsa*": "Restrict SSH key file permissions",
  'eval "$(ssh-agent -s)"': "Start the SSH agent",
  "ssh-add --apple-use-keychain ~/.ssh/id_rsa":
    "Add the key to the agent and keychain",
  "pbcopy < ~/.ssh/id_rsa.pub": "Copy the public key to the clipboard",
  "cat ~/.ssh/id_rsa.pub": "Print the public key",
  "ssh -T git@github.com -i ~/.ssh/id_rsa": "Test the key against GitHub",
  'alias a="atom ."': "Shell aliases for launching editors",
  "<ol>": "Nested ordered list HTML",
  ".visually-hidden:not(:focus-within, :active) {":
    "Visually hidden utility CSS",
  "document.body.classList.remove('no-js');":
    "JavaScript removing the no-js class",
};

/**
 * Looks up the hand-written label for a code block
 * @param {Object} context - Plugin callback context
 * @param {string} context.content - Raw code block content
 * @returns {string} - The block's accessible name
 */
const codeBlockLabel = ({ content }) => {
  const firstLine = content.trim().split("\n")[0].trim();
  const label = CODE_BLOCK_LABELS[firstLine];
  if (!label) {
    throw new Error(
      `Add an aria-label to CODE_BLOCK_LABELS in .eleventy.js for the code block starting with: ${firstLine}`,
    );
  }
  return label;
};

/**
 * Configures plugins for Eleventy
 * @param {Object} eleventyConfig - Eleventy configuration object
 */
const configurePlugins = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginGitCommitDate);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight, {
    // Code blocks scroll horizontally, so they must be keyboard
    // focusable, and a focusable region needs an accessible name
    preAttributes: {
      tabindex: 0,
      role: "region",
      "aria-label": codeBlockLabel,
    },
  });
};

// Main Configuration Function
export default function (eleventyConfig) {
  // Configure Layout Aliases
  Object.entries(LAYOUT_ALIASES).forEach(([alias, layout]) => {
    eleventyConfig.addLayoutAlias(alias, layout);
  });

  // Configure Static Asset Copying
  STATIC_ASSETS.forEach((asset) => {
    eleventyConfig.addPassthroughCopy(asset);
  });

  // Configure Liquid Options
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true,
    root: ["_includes"],
  });

  // Picture Shortcode
  eleventyConfig.addShortcode(
    "picture",
    async function (fileName, ext, width, height, max, alt, caption) {
      const fullPath = `/img/${fileName}`;
      const sizes = [];

      // Configure sizes based on max parameter
      sizes.push({ width: 240, media: MEDIA_BREAKPOINTS.mobile.media });
      sizes.push({ width: 800, media: MEDIA_BREAKPOINTS.tablet.media });

      if (max === "1024" || max === "1600") {
        sizes.push({ width: 1024, media: MEDIA_BREAKPOINTS.desktop.media });
      }
      if (max === "1600") {
        sizes.push({ width: 1600, media: MEDIA_BREAKPOINTS.wide.media });
      }

      // Process image
      await safeImageProcess(
        `img/${fileName}.${ext}`,
        sizes.map((s) => s.width),
        IMAGE_FORMATS,
      );

      // Generate sources
      const sources = generateSourcesets(fullPath, sizes, IMAGE_FORMATS);

      return createPictureElement(
        sources,
        `${fullPath}-240.${ext}`,
        alt,
        width,
        height,
        caption,
      );
    },
  );

  // Video Shortcodes (Vimeo and YouTube)
  const createVideoShortcode = (platform) => {
    return async function (videoId, posterName, ext, width, height, title) {
      const fullPath = `/img/${posterName}`;
      const sizes = [
        { width: 320, media: MEDIA_BREAKPOINTS.mobile.media },
        { width: 800, media: MEDIA_BREAKPOINTS.tablet.media },
        { width: 1280, media: MEDIA_BREAKPOINTS.desktop.media },
      ];

      await safeImageProcess(
        `img/${posterName}.${ext}`,
        sizes.map((s) => s.width),
        IMAGE_FORMATS,
      );
      const sources = generateSourcesets(fullPath, sizes, IMAGE_FORMATS);

      const platformUrl =
        platform === "vimeo"
          ? `https://vimeo.com/${videoId}`
          : `https://www.youtube.com/watch?v=${videoId}`;

      return `
        <div class="facade">
          <a class="facade__link" href="${platformUrl}">
            <span class="visually-hidden">Play: ${escapeHtml(title)} (embedded video)</span>
            <div class="facade__overlay"></div>
            <picture>
              ${Object.values(sources).join("\n")}
              <img src="${fullPath}-320.jpg" alt="" loading="lazy" width="${width}" height="${height}">
            </picture>
          </a>
          <div
            class="facade__video"
            data-type="${platform}"
            data-id="${videoId}"
            data-width="${width}"
            data-height="${height}"
            data-title="${escapeHtml(title)}"
          ></div>
        </div>
      `.trim();
    };
  };

  eleventyConfig.addShortcode("vimeo", createVideoShortcode("vimeo"));
  eleventyConfig.addShortcode("youtube", createVideoShortcode("youtube"));

  // Configure Plugins
  configurePlugins(eleventyConfig);

  // Browser Sync Configuration
  eleventyConfig.setBrowserSyncConfig({
    online: false,
  });

  return {
    dir: {
      input: "./",
      output: "./_site",
    },
  };
}
