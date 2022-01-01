const cleanCSS = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("home", "layouts/home.html");
  eleventyConfig.addLayoutAlias("page", "layouts/page.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");
  eleventyConfig.addLayoutAlias("compress", "layouts/compress.html");

  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("sw.js");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy(".htaccess");

  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true,
    root: ["_includes"],
  });

  eleventyConfig.addShortcode(
    "picture",
    function (fileName, ext, width, height, max, alt, caption) {
      let fullPath = "/img/" + fileName;
      var sourcesWebp =
        '<source media="(max-width: 320px)" srcset="' +
        fullPath +
        '-240.webp" type="image/webp">' +
        '<source media="(max-width: 800px)" srcset="' +
        fullPath +
        '-800.webp" type="image/webp">';
      var sourcesVintage =
        '<source media="(max-width: 800px)" srcset="' +
        fullPath +
        "-800." +
        ext +
        '">';

      if (max !== "1600") {
        sourcesWebp =
          sourcesWebp +
          '<source media="(min-width: 801px)" srcset="' +
          fullPath +
          '-1024.webp" type="image/webp">';

        sourcesVintage =
          sourcesVintage +
          '<source media="(min-width: 801px)" srcset="' +
          fullPath +
          "-1024." +
          ext +
          '">';
      }

      if (max == "1600") {
        sourcesWebp =
          sourcesWebp +
          '<source media="(min-width: 1025px)" srcset="' +
          fullPath +
          '-1600.webp" type="image/webp">';

        sourcesVintage =
          sourcesVintage +
          '<source media="(max-width: 1025px)" srcset="' +
          fullPath +
          "-1600." +
          ext +
          '">';
      }

      return `<figure><picture>${sourcesWebp}${sourcesVintage}<img src="${fullPath}-240.${ext}" alt="${alt}" loading="lazy" width="${width}" height="${height}"></picture><figcaption>${caption}</figcaption></figure>`;
    }
  );
  // Usage: {% picture "file-name", "jpg", "240", "159", "1600" "Alt text.", "Caption" %}

  eleventyConfig.addShortcode(
    "vimeo",
    function (videoId, posterName, width, height, title) {
      let fullPath = "/img/" + posterName;
      var sourcesWebp =
        '<source media="(max-width: 320px)" srcset="' +
        fullPath +
        '-320.webp" type="image/webp">' +
        '<source media="(max-width: 800px)" srcset="' +
        fullPath +
        '-800.webp" type="image/webp">' +
        '<source media="(min-width: 801px)" srcset="' +
        fullPath +
        '-1280.webp" type="image/webp">';
      var sourcesVintage =
        '<source media="(max-width: 800px)" srcset="' +
        fullPath +
        '-800.jpg">' +
        '<source media="(min-width: 801px)" srcset="' +
        fullPath +
        '-1280.jpg">';

      return `<div class="facade"><a class="facade__link" href="https://vimeo.com/${videoId}"><div class="facade__overlay"></div><picture>${sourcesWebp}${sourcesVintage}<img src="${fullPath}-320.jpg" alt="${title}" loading="lazy" width="${width}" height="${height}"></picture></a><div class="facade__video" data-id="${videoId}" data-width="${width}" data-height="${height}" data-title="${title}"></div></div>`;
    }
  );
  // Usage: {% vimeo "222222222", "poster-name", "800", "450", "Video title"}

  eleventyConfig.addFilter("cssmin", function (code) {
    return new cleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addPlugin(pluginRss);

  return {
    dir: {
      input: "./",
      output: "./_site",
    },
  };
};
