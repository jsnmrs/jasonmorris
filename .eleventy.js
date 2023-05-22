const path = require("path");
const Image = require("@11ty/eleventy-img");
const pluginGitCommitDate = require("eleventy-plugin-git-commit-date");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("doc", "layouts/doc.html");
  eleventyConfig.addLayoutAlias("home", "layouts/home.html");
  eleventyConfig.addLayoutAlias("page", "layouts/page.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");
  eleventyConfig.addLayoutAlias("tag", "layouts/tag.html");

  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon-192.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon-512.png");
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
      (async () => {
        let fullName = "imgsrc/" + fileName + "." + ext;
        let metadata = await Image(fullName, {
            widths: [240, 800, 1024, 1600],
            formats: ["webp", "jpeg"],
            outputDir: "./images/",
            filenameFormat: function (id, src, width, format, options) {
              const extension = path.extname(src);
              const name = path.basename(src, extension);
              return `${name}-${width}.${format}`;
            },
        });
      })();


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

      return `<div class="facade"><a class="facade__link" href="https://vimeo.com/${videoId}"><div class="facade__overlay"></div><picture>${sourcesWebp}${sourcesVintage}<img src="${fullPath}-320.jpg" alt="${title}" loading="lazy" width="${width}" height="${height}"></picture></a><div class="facade__video" data-type="vimeo" data-id="${videoId}" data-width="${width}" data-height="${height}" data-title="${title}"></div></div>`;
    }
  );
  // Usage: {% vimeo "222222222", "poster-name", "800", "450", "Video title"}

  eleventyConfig.addShortcode(
    "youtube",
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

      return `<div class="facade"><a class="facade__link" href="https://youtube.com/watch?v=${videoId}"><div class="facade__overlay"></div><picture>${sourcesWebp}${sourcesVintage}<img src="${fullPath}-320.jpg" alt="${title}" loading="lazy" width="${width}" height="${height}"></picture></a><div class="facade__video" data-type="youtube" data-id="${videoId}" data-width="${width}" data-height="${height}" data-title="${title}"></div></div>`;
    }
  );
  // Usage: {% youtube "222222222", "poster-name", "800", "450", "Video title"}

  eleventyConfig.addPlugin(pluginGitCommitDate);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.setBrowserSyncConfig({
    online: false,
  });

  return {
    dir: {
      input: "./",
      output: "./_site",
    },
  };
};
