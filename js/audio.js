(function () {
  "use strict";

  let player;
  let isPlaying = false;

  // Add YouTube iframe API script with error handling
  try {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = function() {
      console.error("Failed to load YouTube iframe API");
    };
    if (document.head) {
      document.head.appendChild(script);
    } else {
      console.error("Document head not available for script insertion");
    }
  } catch (error) {
    console.error("Error inserting YouTube API script:", error);
  }

  window.onYouTubeIframeAPIReady = function () {
    const playerElement = document.getElementById("player");
    if (!playerElement) return;

    const videoId = playerElement.getAttribute("data-video-id");
    if (!videoId) return;

    player = new YT.Player("player", {
      height: "0",
      width: "0",
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
      },
      events: {
        onReady: initializeControls,
      },
    });
  };

  function initializeControls() {
    const playButton = document.getElementById("play-pause-btn");
    const volumeControl = document.getElementById("volume-control");

    if (!playButton || !volumeControl) return;

    playButton.addEventListener("click", togglePlayPause);
    volumeControl.addEventListener("input", updateVolume);
    updateVolume();
  }

  function togglePlayPause() {
    if (!player) return;

    const playButton = document.getElementById("play-pause-btn");
    if (!playButton) return;

    if (isPlaying) {
      player.pauseVideo();
      playButton.textContent = "Play";
    } else {
      player.playVideo();
      playButton.textContent = "Pause";
    }
    isPlaying = !isPlaying;
  }

  function updateVolume() {
    if (!player) return;

    const volumeControl = document.getElementById("volume-control");
    const volumeDisplay = document.getElementById("volume-display");

    if (!volumeControl || !volumeDisplay) return;

    const volume = volumeControl.value;
    player.setVolume(volume);
    volumeDisplay.textContent = volume + "%";
  }
})();
