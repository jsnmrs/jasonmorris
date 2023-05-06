(function facadeOverlay() {
  "use strict";

  const videos = document.querySelectorAll(".facade"),
    videoLinks = document.querySelectorAll(".facade__link");

  if (videos.length === videoLinks.length) {
    videos.forEach((item, index) => {
      videoLinks[`${index}`].addEventListener("click", videoClick, false);
    });
  }

  function videoClick(event) {
    const videoHolder = this.parentNode.children[1];
    let videoIframe;

    event.preventDefault();
    videoHolder.classList.add("video");
    videoIframe = document.createElement("iframe");

    if (videoHolder.dataset.type == "vimeo") {
      videoIframe.setAttribute(
        "src",
        `https://player.vimeo.com/video/${videoHolder.dataset.id}?dnt=true&amp;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff`
      );
    }

    if (videoHolder.dataset.type == "youtube") {
      videoIframe.setAttribute(
        "src",
        `https://www.youtube-nocookie.com/embed/${videoHolder.dataset.id}?rel=0&amp;showinfo=0`
      );
    }

    videoIframe.setAttribute(
      "title",
      `${videoHolder.dataset.title} — embedded video`
    );
    videoIframe.setAttribute("width", videoHolder.dataset.width);
    videoIframe.setAttribute("height", videoHolder.dataset.height);
    videoIframe.setAttribute("frameborder", "0");
    videoIframe.setAttribute("allowfullscreen", "");
    videoHolder.appendChild(videoIframe);
    this.remove();
  }
})();
