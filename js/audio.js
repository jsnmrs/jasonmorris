(function () {
  "use strict";

  let player;
  let isPlaying = false;

  // Cache DOM elements
  let playButton;
  let volumeControl;
  let volumeDisplay;

  // Element selectors
  const SELECTORS = {
    player: "#player",
    playButton: "#play-pause-btn",
    volumeControl: "#volume-control",
    volumeDisplay: "#volume-display",
  };

  // Load YouTube iframe API using our shared utility
  try {
    MediaUtils.youtube.loadAPI();
  } catch (error) {
    MediaUtils.logError("Failed to load YouTube API:", error);
  }

  window.onYouTubeIframeAPIReady = function () {
    try {
      const playerElement = document.querySelector(SELECTORS.player);
      if (!playerElement) return;

      const videoId = playerElement.getAttribute("data-video-id");
      if (!videoId) {
        MediaUtils.logError(
          "Missing data-video-id attribute on player element",
        );
        return;
      }

      player = MediaUtils.youtube.createPlayer(
        SELECTORS.player.substring(1), // Remove # for YouTube API
        videoId,
        initializeControls,
      );
    } catch (error) {
      MediaUtils.logError("Error initializing YouTube player:", error);
    }
  };

  function initializeControls() {
    try {
      // Cache DOM elements on initialization
      playButton = document.querySelector(SELECTORS.playButton);
      volumeControl = document.querySelector(SELECTORS.volumeControl);
      volumeDisplay = document.querySelector(SELECTORS.volumeDisplay);

      if (!playButton || !volumeControl) {
        MediaUtils.logError("Missing required audio control elements");
        return;
      }

      playButton.addEventListener("click", togglePlayPause);
      volumeControl.addEventListener("input", updateVolume);
      updateVolume();
    } catch (error) {
      MediaUtils.logError("Error initializing audio controls:", error);
    }
  }

  function togglePlayPause() {
    try {
      if (!player || !playButton) return;

      if (isPlaying) {
        player.pauseVideo();
        playButton.textContent = "Play";
      } else {
        player.playVideo();
        playButton.textContent = "Pause";
      }
      isPlaying = !isPlaying;
    } catch (error) {
      MediaUtils.logError("Error toggling play/pause state:", error);
    }
  }

  function updateVolume() {
    try {
      if (!player || !volumeControl || !volumeDisplay) return;

      const volume = volumeControl.value;
      player.setVolume(volume);
      volumeDisplay.textContent = volume + "%";
    } catch (error) {
      MediaUtils.logError("Error updating volume:", error);
    }
  }
})();
