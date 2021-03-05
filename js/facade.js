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
    var videoHolder = this.parentNode.children[1];

    event.preventDefault();
    videoHolder.classList.add("video");
    videoHolder.innerHTML =
      '<iframe src="https://player.vimeo.com/video/' +
      videoHolder.dataset.id +
      '?dnt=true&amp;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" title="' +
      videoHolder.dataset.title +
      '" width="' +
      videoHolder.dataset.width +
      '" height="' +
      videoHolder.dataset.height +
      '" frameborder="0" allowfullscreen></iframe>';
    this.remove();
  }

  return true;
})();
