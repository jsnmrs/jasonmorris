import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// One representative page per layout, plus the style guide and 404.
const PAGES = [
  "/",
  "/bikes/deck-dancing-via-tripod/",
  "/code/rotating-ssh-keys/",
  "/links/",
  "/resume/",
  "/accessibility/",
  "/one/",
  "/bikes/",
  "/styleguide/",
  "/404.html",
];

// 320 CSS px is the WCAG 1.4.10 reflow breakpoint (400% zoom at 1280px).
// The daily axe crawl only scans at desktop width, so narrow-viewport
// issues like reflow and scrollable regions are covered here.
test.use({ viewport: { width: 320, height: 700 } });

for (const path of PAGES) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      // Keep scans deterministic: block requests that leave the site
      await page.route(
        (url) => url.hostname !== "localhost",
        (route) => route.abort(),
      );
      await page.goto(path);
    });

    test("does not scroll horizontally", async ({ page }) => {
      // scrollbar-gutter: stable can leave clientWidth wider than
      // scrollWidth, so only a positive difference is real overflow
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test("passes axe", async ({ page }) => {
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
}
