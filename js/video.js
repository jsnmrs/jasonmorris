(function () {
  "use strict";

  function handleVideoClick(event) {
    const link = event.target.closest(".facade__link");
    if (!link) return;

    event.preventDefault();
    const videoHolder = link.nextElementSibling;

    if (!videoHolder) return;

    const { type, id, width, height, title } = videoHolder.dataset;

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

    videoHolder.classList.add("video");
    videoHolder.appendChild(iframe);
    link.remove();
  }

  document.addEventListener("click", handleVideoClick);
})();
