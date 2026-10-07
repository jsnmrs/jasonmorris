import { defineConfig } from "@playwright/test";

// Run `npm run build` first so the site and inlined assets exist.
export default defineConfig({
  testDir: "../tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:8080",
  },
  webServer: {
    // Playwright spawns the command from the config file directory, so
    // point it back at the project root where Eleventy expects to run
    cwd: "..",
    command: "npx @11ty/eleventy --serve --quiet",
    url: "http://localhost:8080/",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
