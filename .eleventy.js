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
        alt="${alt}"
        loading="lazy"
        width="${width}"
        height="${height}"
      >
    </picture>
  `.trim();

  return caption
    ? `<figure>${picture}<figcaption>${caption}</figcaption></figure>`
    : picture;
};

/**
 * Configures plugins for Eleventy
 * @param {Object} eleventyConfig - Eleventy configuration object
 */
const configurePlugins = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginGitCommitDate);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: { tabindex: 0 },
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
          : `https://youtube.com/watch?v=${videoId}`;

      return `
        <div class="facade">
          <a class="facade__link" href="${platformUrl}">
            <div class="facade__overlay"></div>
            <picture>
              ${Object.values(sources).join("\n")}
              <img src="${fullPath}-320.jpg" alt="${title}" loading="lazy" width="${width}" height="${height}">
            </picture>
          </a>
          <div
            class="facade__video"
            data-type="${platform}"
            data-id="${videoId}"
            data-width="${width}"
            data-height="${height}"
            data-title="${title}"
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
