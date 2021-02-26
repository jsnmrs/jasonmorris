const cleanCSS = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const htmlMinTransform = require("./_transforms/html-min.js");

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

  eleventyConfig.addFilter("cssmin", function (code) {
    return new cleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addTransform("htmlmin", htmlMinTransform);

  return {
    dir: {
      input: "./",
      output: "./_site",
    },
  };
};
