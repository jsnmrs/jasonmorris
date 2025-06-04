(function () {
  "use strict";

  // Check if MediaUtils is available
  if (typeof MediaUtils === "undefined") {
    // Use Logger if available, otherwise fallback to console
    if (window.Logger && window.Logger.error) {
      window.Logger.error(
        "MediaUtils not loaded - video player cannot initialize",
      );
    } else {
      console.error("MediaUtils not loaded - video player cannot initialize");
    }
    return;
  }

  // AbortController for managing event listeners
  let eventController = null;

  // Track if module has been initialized
  let isInitialized = false;

  // Handle clicks on video facade links to load actual players
  function handleVideoClick(event) {
    try {
      // Check if clicked element is within a video facade link
      const link = event.target.closest(".facade__link");
      if (!link) return;

      event.preventDefault();

      // Find the video holder element that follows the link
      const videoHolder = link.nextElementSibling;
      if (!videoHolder) return;

      // Extract video configuration from data attributes
      const { type, id, width, height, title } = videoHolder.dataset;

      // Validate required data
      if (!type || !id) {
        MediaUtils.logError("Missing required video data attributes");
        return;
      }

      // Create iframe using our shared utility
      if (MediaUtils.createVideoIframe) {
        const iframe = MediaUtils.createVideoIframe({
          type,
          id,
          width,
          height,
          title,
        });

        if (iframe) {
          // Apply video styling and replace facade with iframe
          videoHolder.classList.add("video");
          videoHolder.appendChild(iframe);
          link.remove();
        } else {
          MediaUtils.logError("Failed to create video iframe");
        }
      } else {
        MediaUtils.logError("createVideoIframe function not available");
      }
    } catch (error) {
      MediaUtils.logError("Error handling video click event:", error);
    }
  }

  // Initialize video player functionality
  function initializeVideoPlayer() {
    // Prevent multiple initializations
    if (isInitialized) {
      if (window.Logger && window.Logger.warn) {
        window.Logger.warn("Video player already initialized");
      }
      return;
    }

    try {
      // Create new AbortController for this initialization
      eventController = new AbortController();

      // Use more specific event delegation - look for video containers
      const videoContainers = document.querySelectorAll("[data-type]");

      if (videoContainers.length > 0) {
        // Attach listeners to specific containers instead of document
        videoContainers.forEach((container) => {
          const parentElement = container.parentElement;
          if (parentElement) {
            parentElement.addEventListener("click", handleVideoClick, {
              signal: eventController.signal,
              passive: false,
            });
          }
        });
      } else {
        // Fallback to document listener if no containers found
        document.addEventListener("click", handleVideoClick, {
          signal: eventController.signal,
          passive: false,
        });
      }

      isInitialized = true;

      if (window.Logger && window.Logger.debug) {
        window.Logger.debug(
          "Video player initialized with",
          videoContainers.length,
          "containers",
        );
      }
    } catch (error) {
      MediaUtils.logError("Failed to initialize video player:", error);
    }
  }

  // Cleanup function for removing event listeners
  function cleanup() {
    if (eventController) {
      eventController.abort();
      eventController = null;
    }
    isInitialized = false;

    if (window.Logger && window.Logger.debug) {
      window.Logger.debug("Video player cleanup completed");
    }
  }

  // Expose cleanup function globally for potential SPA usage
  if (window.MediaUtils) {
    window.MediaUtils.videoCleanup = cleanup;
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeVideoPlayer);
  } else {
    initializeVideoPlayer();
  }

  // Cleanup on page unload (for SPA scenarios)
  window.addEventListener("beforeunload", cleanup);
})();
