(function () {
  "use strict";

  function handleVideoClick(event) {
    try {
      const link = event.target.closest(".facade__link");
      if (!link) return;

      event.preventDefault();
      const videoHolder = link.nextElementSibling;

      if (!videoHolder) return;

      const { type, id, width, height, title } = videoHolder.dataset;

      // Create iframe using our shared utility
      const iframe = MediaUtils.createVideoIframe({
        type,
        id,
        width,
        height,
        title,
      });

      if (iframe) {
        videoHolder.classList.add("video");
        videoHolder.appendChild(iframe);
        link.remove();
      }
    } catch (error) {
      MediaUtils.logError("Error handling video click event:", error);
    }
  }

  document.addEventListener("click", handleVideoClick);
})();
