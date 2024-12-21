import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    autoprefixer({
      grid: false,
    }),
    cssnano({
      preset: "default",
    }),
  ],
};
