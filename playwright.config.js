import { defineConfig } from "@playwright/test";

// Run `npm run build` first so the site and inlined assets exist.
export default defineConfig({
  testDir: "tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:8080",
  },
  webServer: {
    command: "npx @11ty/eleventy --serve --quiet",
    url: "http://localhost:8080/",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
