(function () {
  "use strict";

  // Ensure MediaUtils namespace exists
  if (!window.MediaUtils) {
    window.MediaUtils = {};
  }

  // YouTube API helper functions
  window.MediaUtils.youtube = {
    // Load YouTube iframe API script dynamically
    loadAPI: function (callback) {
      // Ensure loadScript utility is available
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
        // Use Logger if available, otherwise fallback to console
        if (window.Logger && window.Logger.error) {
          window.Logger.error("MediaUtils.loadScript is not available");
        } else {
          console.error("MediaUtils.loadScript is not available");
        }
      }
    },

    // Create invisible YouTube player for audio-only playback
    createPlayer: function (elementId, videoId, onReady) {
      // Verify YouTube API is loaded
      if (!window.YT) {
        window.MediaUtils.logError("YouTube API not loaded");
        return null;
      }

      try {
        // Initialize player with minimal dimensions (audio-only use)
        return new YT.Player(elementId, {
          height: "0",
          width: "0",
          videoId: videoId,
          playerVars: {
            autoplay: 0, // Don't autoplay
            controls: 0, // Hide default controls
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
