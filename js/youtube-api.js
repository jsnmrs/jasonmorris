(function () {
  "use strict";

  // Ensure MediaUtils exists
  if (!window.MediaUtils) {
    window.MediaUtils = {};
  }

  // YouTube API helpers
  window.MediaUtils.youtube = {
    // Load YouTube API
    loadAPI: function (callback) {
      if (window.MediaUtils.loadScript) {
        window.MediaUtils.loadScript(
          "https://www.youtube.com/iframe_api",
          callback,
          function (error) {
            window.MediaUtils.logError(
              "Failed to load YouTube iframe API",
              error,
            );
          },
        );
      } else {
        console.error("MediaUtils.loadScript is not available");
      }
    },

    // Create invisible YouTube player
    createPlayer: function (elementId, videoId, onReady) {
      if (!window.YT) {
        window.MediaUtils.logError("YouTube API not loaded");
        return null;
      }

      try {
        return new YT.Player(elementId, {
          height: "0",
          width: "0",
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
          },
          events: {
            onReady: onReady,
          },
        });
      } catch (error) {
        window.MediaUtils.logError("Error creating YouTube player:", error);
        return null;
      }
    },
  };
})();
