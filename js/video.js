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

      // Validate required data attributes
      if (!type || !id) {
        console.error("Missing required video data attributes");
        return;
      }

      try {
        const iframe = document.createElement("iframe");
        const srcUrl =
          type === "vimeo"
            ? `https://player.vimeo.com/video/${id}?dnt=true&title=0&byline=0&portrait=0&color=ffffff`
            : `https://www.youtube-nocookie.com/embed/${id}?rel=0&showinfo=0`;

        iframe.src = srcUrl;
        iframe.title = `${title} — embedded video`;
        iframe.width = width;
        iframe.height = height;
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "");

        // Add error handler for iframe loading failures
        iframe.onerror = function () {
          console.error(`Failed to load ${type} video with ID: ${id}`);
        };

        videoHolder.classList.add("video");
        videoHolder.appendChild(iframe);
        link.remove();
      } catch (frameError) {
        console.error("Error creating video iframe:", frameError);
      }
    } catch (error) {
      console.error("Error handling video click event:", error);
    }
  }

  document.addEventListener("click", handleVideoClick);
})();
