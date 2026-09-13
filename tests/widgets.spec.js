import { test, expect } from "@playwright/test";

// Minimal stand-in for the YouTube iframe API so the audio player tests
// exercise this site's code deterministically, without network access.
// window.__ytStubEnd() simulates the track reaching its end.
const YT_STUB = `
  window.YT = {
    PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
    Player: function (elementId, config) {
      let state = -1;
      const player = {
        playVideo() { state = 1; config.events.onStateChange({ data: 1 }); },
        pauseVideo() { state = 2; config.events.onStateChange({ data: 2 }); },
        setVolume() {},
        getPlayerState() { return state; },
      };
      window.__ytStubEnd = function () { state = 0; config.events.onStateChange({ data: 0 }); };
      setTimeout(function () { config.events.onReady({ target: player }); }, 0);
      return player;
    },
  };
  if (window.onYouTubeIframeAPIReady) window.onYouTubeIframeAPIReady();
`;

test("video facade hands keyboard focus to a titled iframe", async ({
  page,
}) => {
  // The iframe never needs to load real video content for this test
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ contentType: "text/html", body: "" }),
  );
  await page.goto("/bikes/deck-dancing-via-tripod/");

  const link = page.locator(".facade__link");
  await link.focus();
  await page.keyboard.press("Enter");

  const iframe = page.locator(".facade__video iframe");
  await expect(iframe).toHaveAttribute("title", / — embedded video$/);
  await expect(link).toHaveCount(0);
  expect(await page.evaluate(() => document.activeElement.tagName)).toBe(
    "IFRAME",
  );
});

test("audio player button label follows the real player state", async ({
  page,
}) => {
  await page.route("https://www.youtube.com/iframe_api", (route) =>
    route.fulfill({ contentType: "application/javascript", body: YT_STUB }),
  );
  await page.goto("/one/");

  const button = page.locator("#play-pause-btn");
  await expect(button).toBeEnabled();

  await button.click();
  await expect(button).toHaveText("Pause");

  await page.evaluate(() => window.__ytStubEnd());
  await expect(button).toHaveText("Play");
});

test("audio player button stays disabled when the API never loads", async ({
  page,
}) => {
  await page.route("https://www.youtube.com/iframe_api", (route) =>
    route.abort(),
  );
  await page.goto("/one/");

  const button = page.locator("#play-pause-btn");
  await expect(button).toBeDisabled();
  // Give any stray enable logic a moment to run, then confirm nothing did
  await page.waitForTimeout(1000);
  await expect(button).toBeDisabled();
});
