(function facadeOverlay() {
  "use strict";

  var videos = document.querySelectorAll(".facade"),
    videoLinks = document.querySelectorAll(".facade__link"),
    j;

  if (videos.length !== videoLinks.length) {
    return false;
  }

  for (j = 0; j < videos.length; j++) {
    videoLinks[j].addEventListener("click", videoClick, false);
  }

  function videoClick(event) {
    var videoHolder = this.parentNode.children[1],
      videoIframe;

    event.preventDefault();
    videoHolder.classList.add("video");
    videoIframe = document.createElement("iframe");
    videoIframe.setAttribute(
      "src",
      "https://player.vimeo.com/video/" +
        videoHolder.dataset.id +
        "?dnt=true&amp;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff)"
    );
    videoIframe.setAttribute(
      "title",
      videoHolder.dataset.title + " — embedded video"
    );
    videoIframe.setAttribute("width", videoHolder.dataset.width);
    videoIframe.setAttribute("height", videoHolder.dataset.height);
    videoIframe.setAttribute("frameborder", "0");
    videoIframe.setAttribute("allowfullscreen", "");
    videoHolder.appendChild(videoIframe);
    this.remove();
  }

  return true;
})();
