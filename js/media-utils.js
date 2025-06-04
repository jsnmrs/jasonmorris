(function () {
  "use strict";

  // Global error handler
  window.addEventListener("error", function (event) {
    if (window.MediaUtils && window.MediaUtils.logError) {
      window.MediaUtils.logError("Global error:", {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
      });
    }
  });

  // Global unhandled promise rejection handler
  window.addEventListener("unhandledrejection", function (event) {
    if (window.MediaUtils && window.MediaUtils.logError) {
      window.MediaUtils.logError("Unhandled promise rejection:", event.reason);
    }
  });

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

        // Attach load callback if provided
        if (onLoad) {
          script.onload = onLoad;
        }

        // Handle script loading failures
        script.onerror = function () {
          const errorMsg = "Failed to load script: " + src;
          MediaUtils.logError(errorMsg);
          if (onError) onError(errorMsg);
        };

        // Ensure document.head exists before appending
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
        // Vimeo: privacy-enhanced player with minimal UI
        // YouTube: privacy-enhanced domain with related videos disabled
        const srcUrl =
          type === "vimeo"
            ? `https://player.vimeo.com/video/${id}?dnt=true&title=0&byline=0&portrait=0&color=ffffff`
            : `https://www.youtube-nocookie.com/embed/${id}?rel=0&showinfo=0`;

        // Set iframe properties for accessibility and display
        iframe.src = srcUrl;
        iframe.title = title
          ? `${title} — embedded video`
          : `Embedded ${type} video`;
        iframe.width = width;
        iframe.height = height;
        iframe.setAttribute("frameborder", frameborder);

        // Enable fullscreen capability if requested
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
