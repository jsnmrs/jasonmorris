module.exports = {
  plugins: [
    require("autoprefixer")({
      grid: false,
    }),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
