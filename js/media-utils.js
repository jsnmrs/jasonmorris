(function () {
  "use strict";

  // Expose utilities through a namespace
  window.MediaUtils = {
    // Common error logging function
    logError: function (message, error) {
      console.error(message, error || "");
    },

    // Load external script with error handling
    loadScript: function (src, onLoad, onError) {
      try {
        const script = document.createElement("script");
        script.src = src;

        if (onLoad) {
          script.onload = onLoad;
        }

        script.onerror = function () {
          const errorMsg = "Failed to load script: " + src;
          MediaUtils.logError(errorMsg);
          if (onError) onError(errorMsg);
        };

        if (document.head) {
          document.head.appendChild(script);
        } else {
          MediaUtils.logError(
            "Document head not available for script insertion",
          );
        }
      } catch (error) {
        MediaUtils.logError("Error inserting script: " + src, error);
        if (onError) onError(error);
      }
    },

    // Create iframe for video embedding
    createVideoIframe: function ({
      type,
      id,
      width = "640",
      height = "360",
      title = "",
      allowFullscreen = true,
      frameborder = "0",
    } = {}) {
      // Validate required parameters
      if (!type || !id) {
        MediaUtils.logError(
          "Missing required video data attributes (type and id)",
        );
        return null;
      }

      try {
        const iframe = document.createElement("iframe");

        // Set source URL based on video type
        const srcUrl =
          type === "vimeo"
            ? `https://player.vimeo.com/video/${id}?dnt=true&title=0&byline=0&portrait=0&color=ffffff`
            : `https://www.youtube-nocookie.com/embed/${id}?rel=0&showinfo=0`;

        // Set iframe properties
        iframe.src = srcUrl;
        iframe.title = title
          ? `${title} — embedded video`
          : `Embedded ${type} video`;
        iframe.width = width;
        iframe.height = height;
        iframe.setAttribute("frameborder", frameborder);

        if (allowFullscreen) {
          iframe.setAttribute("allowfullscreen", "");
        }

        // Add error handler for iframe loading failures
        iframe.onerror = function () {
          MediaUtils.logError(`Failed to load ${type} video with ID: ${id}`);
        };

        return iframe;
      } catch (error) {
        MediaUtils.logError("Error creating video iframe:", error);
        return null;
      }
    },

    // YouTube API helpers moved to dedicated youtube-api.js module
  };
})();
