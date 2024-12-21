import path from "path";
import Image from "@11ty/eleventy-img";
import pluginGitCommitDate from "eleventy-plugin-git-commit-date";
import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("audiograph", "layouts/audiograph.html");
  eleventyConfig.addLayoutAlias("doc", "layouts/doc.html");
  eleventyConfig.addLayoutAlias("home", "layouts/home.html");
  eleventyConfig.addLayoutAlias("page", "layouts/page.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");
  eleventyConfig.addLayoutAlias("tag", "layouts/tag.html");

  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("jason-morris-resume.pdf");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon-192.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon-512.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("rss.xsl");
  eleventyConfig.addPassthroughCopy("sitemap.xsl");
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
      var sourcesAvif =
        '<source media="(max-width: 320px)" srcset="' +
        fullPath +
        '-240.avif" type="image/avif">' +
        '<source media="(max-width: 800px)" srcset="' +
        fullPath +
        '-800.avif" type="image/avif">';
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

      if (max == "800") {
        sourcesAvif =
          sourcesAvif +
          '<source media="(min-width: 801px)" srcset="' +
          fullPath +
          '-800.avif" type="image/avif">';
        sourcesWebp =
          sourcesWebp +
          '<source media="(min-width: 801px)" srcset="' +
          fullPath +
          '-800.webp" type="image/webp">';
        sourcesVintage =
          sourcesVintage +
          '<source media="(min-width: 801px)" srcset="' +
          fullPath +
          "-800." +
          ext +
          '">';
      }

      if (max == "1600" || max == "1024") {
        sourcesAvif =
          sourcesAvif +
          '<source media="(min-width: 801px)" srcset="' +
          fullPath +
          '-1024.avif" type="image/avif">';
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
        sourcesAvif =
          sourcesAvif +
          '<source media="(min-width: 1025px)" srcset="' +
          fullPath +
          '-1600.avif" type="image/avif">';
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
        let fullName = "img/" + fileName + "." + ext;
        let metadata = await Image(fullName, {
          widths: [240, 800, 1024, 1600],
          formats: ["webp", "avif", "jpeg"],
          outputDir: "./img/",
          filenameFormat: function (id, src, width, format, options) {
            let extension = path.extname(src),
              outExt = format;
            const name = path.basename(src, extension);
            if (outExt == "jpeg") {
              outExt = "jpg";
            }
            return `${name}-${width}.${outExt}`;
          },
        });
      })();

      return `${
        caption ? `<figure>` : ""
      }<picture>${sourcesAvif}${sourcesWebp}${sourcesVintage}<img src="${fullPath}-240.${ext}" alt="${alt}" loading="lazy" width="${width}" height="${height}"></picture>${
        caption ? `<figcaption>${caption}</figcaption>` : ""
      }${caption ? `</figure>` : ""}`;
    },
  );

  eleventyConfig.addShortcode(
    "vimeo",
    function (videoId, posterName, ext, width, height, title) {
      let fullPath = "/img/" + posterName;
      var sourcesAvif =
        '<source media="(max-width: 320px)" srcset="' +
        fullPath +
        '-320.avif" type="image/avif">' +
        '<source media="(max-width: 800px)" srcset="' +
        fullPath +
        '-800.avif" type="image/avif">' +
        '<source media="(min-width: 801px)" srcset="' +
        fullPath +
        '-1280.avif" type="image/avif">';
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
      (async () => {
        let fullName = "img/" + posterName + "." + ext;
        let metadata = await Image(fullName, {
          widths: [320, 800, 1280],
          formats: ["webp", "avif", "jpeg"],
          outputDir: "./img/",
          filenameFormat: function (id, src, width, format, options) {
            let extension = path.extname(src),
              outExt = format;
            const name = path.basename(src, extension);
            if (outExt == "jpeg") {
              outExt = "jpg";
            }
            return `${name}-${width}.${outExt}`;
          },
        });
      })();

      return `<div class="facade"><a class="facade__link" href="https://vimeo.com/${videoId}"><div class="facade__overlay"></div><picture>${sourcesAvif}${sourcesWebp}${sourcesVintage}<img src="${fullPath}-320.jpg" alt="${title}" loading="lazy" width="${width}" height="${height}"></picture></a><div class="facade__video" data-type="vimeo" data-id="${videoId}" data-width="${width}" data-height="${height}" data-title="${title}"></div></div>`;
    },
  );

  eleventyConfig.addShortcode(
    "youtube",
    function (videoId, posterName, ext, width, height, title) {
      let fullPath = "/img/" + posterName;
      var sourcesAvif =
        '<source media="(max-width: 320px)" srcset="' +
        fullPath +
        '-320.avif" type="image/avif">' +
        '<source media="(max-width: 800px)" srcset="' +
        fullPath +
        '-800.avif" type="image/avif">' +
        '<source media="(min-width: 801px)" srcset="' +
        fullPath +
        '-1280.avif" type="image/avif">';
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
      (async () => {
        let fullName = "img/" + posterName + "." + ext;
        let metadata = await Image(fullName, {
          widths: [320, 800, 1280],
          formats: ["webp", "avif", "jpeg"],
          outputDir: "./img/",
          filenameFormat: function (id, src, width, format, options) {
            let extension = path.extname(src),
              outExt = format;
            const name = path.basename(src, extension);
            if (outExt == "jpeg") {
              outExt = "jpg";
            }
            return `${name}-${width}.${outExt}`;
          },
        });
      })();

      return `<div class="facade"><a class="facade__link" href="https://youtube.com/watch?v=${videoId}"><div class="facade__overlay"></div><picture>${sourcesAvif}${sourcesWebp}${sourcesVintage}<img src="${fullPath}-320.jpg" alt="${title}" loading="lazy" width="${width}" height="${height}"></picture></a><div class="facade__video" data-type="youtube" data-id="${videoId}" data-width="${width}" data-height="${height}" data-title="${title}"></div></div>`;
    },
  );

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
}
