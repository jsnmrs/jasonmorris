import { test, expect } from "@playwright/test";

// Each <source> in shortcode-generated <picture> markup holds one URL and
// is selected by media query, so every viewport must resolve to the
// largest variant that fits: no fall-through to the 240px fallback <img>
// on wide screens, and the widest generated file must actually be
// reachable. currentSrc reports the browser's pick in its preferred
// format, so assertions accept any generated extension.
const CASES = [
  {
    path: "/three/",
    image: "unit",
    picks: [
      { viewport: { width: 320, height: 700 }, width: 240 },
      { viewport: { width: 800, height: 900 }, width: 800 },
      { viewport: { width: 1400, height: 900 }, width: 800 },
    ],
  },
  {
    path: "/egolf/",
    image: "egolf",
    picks: [
      { viewport: { width: 700, height: 900 }, width: 800 },
      { viewport: { width: 900, height: 900 }, width: 1024 },
      { viewport: { width: 1400, height: 900 }, width: 1600 },
    ],
  },
  {
    path: "/bikes/bikes-and-barns/",
    image: "barn",
    picks: [{ viewport: { width: 1400, height: 900 }, width: 1024 }],
  },
  {
    path: "/bikes/bikes-and-barns/",
    image: "video-barn",
    picks: [{ viewport: { width: 1400, height: 900 }, width: 1280 }],
  },
];

for (const { path, image, picks } of CASES) {
  for (const { viewport, width } of picks) {
    test.describe(`${path} ${image} at ${viewport.width}px`, () => {
      test.use({ viewport });

      test(`serves the ${width}px variant`, async ({ page }) => {
        // Keep runs deterministic: block requests that leave the site
        await page.route(
          (url) => url.hostname !== "localhost",
          (route) => route.abort(),
        );
        await page.goto(path);

        const img = page.locator(`img[src*="/img/${image}-"]`);
        // Images are lazy-loaded, so bring the target into view before
        // the browser commits to a source
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() => img.evaluate((el) => el.currentSrc))
          .toMatch(new RegExp(`/img/${image}-${width}\\.(avif|webp|jpg)$`));
      });
    });
  }
}
