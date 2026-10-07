import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    autoprefixer({
      grid: false,
    }),
    cssnano({
      // reduceInitial rewrites color: CanvasText to color: initial,
      // which engines resolve as the UA default instead of the
      // theme-aware system color in forced-colors mode
      preset: ["default", { reduceInitial: false }],
    }),
  ],
};
