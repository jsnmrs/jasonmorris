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
      event.preventDefault();

      // The link is the event target since we attach directly to it
      const link = event.currentTarget;

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

          // Move focus to the iframe to maintain keyboard navigation
          iframe.focus();
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

      // Attach click listeners directly to facade links for accessibility
      // This avoids adding click handlers to non-interactive parent divs
      const facadeLinks = document.querySelectorAll(".facade__link");

      facadeLinks.forEach((link) => {
        link.addEventListener("click", handleVideoClick, {
          signal: eventController.signal,
          passive: false,
        });
      });

      isInitialized = true;

      if (window.Logger && window.Logger.debug) {
        window.Logger.debug(
          "Video player initialized with",
          facadeLinks.length,
          "facade links",
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
