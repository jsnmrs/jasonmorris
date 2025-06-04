(function () {
  "use strict";

  // Check if MediaUtils is available
  if (typeof MediaUtils === "undefined") {
    console.error("MediaUtils not loaded - video player cannot initialize");
    return;
  }

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

  // Attach event listener with error handling
  try {
    document.addEventListener("click", handleVideoClick);
  } catch (error) {
    MediaUtils.logError("Failed to attach video click handler:", error);
  }
})();
