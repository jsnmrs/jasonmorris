(function () {
  "use strict";

  // YouTube player instance
  let player;
  let isPlaying = false;

  // Cache DOM elements for performance
  let playButton;
  let volumeControl;
  let volumeDisplay;

  // AbortController for managing event listeners
  let audioController = null;

  // Track if audio controls have been initialized
  let controlsInitialized = false;

  // Element selectors for audio controls
  const SELECTORS = {
    player: "#player",
    playButton: "#play-pause-btn",
    volumeControl: "#volume-control",
    volumeDisplay: "#volume-display",
  };

  // Load YouTube iframe API using our shared utility
  if (typeof MediaUtils === "undefined") {
    // Use Logger if available, otherwise fallback to console
    if (window.Logger && window.Logger.error) {
      window.Logger.error(
        "MediaUtils not loaded - audio player cannot initialize",
      );
    } else {
      console.error("MediaUtils not loaded - audio player cannot initialize");
    }
    return;
  }

  if (MediaUtils.youtube && MediaUtils.youtube.loadAPI) {
    try {
      MediaUtils.youtube.loadAPI();
    } catch (error) {
      MediaUtils.logError("Failed to load YouTube API:", error);
    }
  } else {
    MediaUtils.logError("YouTube utilities not available");
  }

  // YouTube API callback - called when API is ready
  window.onYouTubeIframeAPIReady = function () {
    try {
      const playerElement = document.querySelector(SELECTORS.player);
      if (!playerElement) return;

      // Extract video ID from data attribute
      const videoId = playerElement.getAttribute("data-video-id");
      if (!videoId) {
        MediaUtils.logError(
          "Missing data-video-id attribute on player element",
        );
        return;
      }

      // Create invisible YouTube player for audio playback
      player = MediaUtils.youtube.createPlayer(
        SELECTORS.player.substring(1), // Remove # for YouTube API
        videoId,
        initializeControls,
      );
    } catch (error) {
      MediaUtils.logError("Error initializing YouTube player:", error);
    }
  };

  // Initialize audio control interface after player is ready
  function initializeControls() {
    try {
      // Prevent multiple initializations
      if (controlsInitialized) {
        if (window.Logger && window.Logger.warn) {
          window.Logger.warn("Audio controls already initialized");
        }
        return;
      }

      // Cache DOM elements on initialization
      playButton = document.querySelector(SELECTORS.playButton);
      volumeControl = document.querySelector(SELECTORS.volumeControl);
      volumeDisplay = document.querySelector(SELECTORS.volumeDisplay);

      // Ensure required controls exist
      if (!playButton || !volumeControl) {
        MediaUtils.logError("Missing required audio control elements");
        return;
      }

      // Create AbortController for event listener management
      audioController = new AbortController();

      // Attach event listeners for user interaction with cleanup capability
      playButton.addEventListener("click", togglePlayPause, {
        signal: audioController.signal,
      });
      volumeControl.addEventListener("input", updateVolume, {
        signal: audioController.signal,
      });

      controlsInitialized = true;

      // Set initial volume display
      updateVolume();

      if (window.Logger && window.Logger.debug) {
        window.Logger.debug("Audio controls initialized");
      }
    } catch (error) {
      MediaUtils.logError("Error initializing audio controls:", error);
    }
  }

  // Toggle between play and pause states
  function togglePlayPause() {
    try {
      if (!player || !playButton) return;

      // Update player state and button text
      if (isPlaying) {
        player.pauseVideo();
        playButton.textContent = "Play";
      } else {
        player.playVideo();
        playButton.textContent = "Pause";
      }

      // Track current playback state
      isPlaying = !isPlaying;
    } catch (error) {
      MediaUtils.logError("Error toggling play/pause state:", error);
    }
  }

  // Update player volume based on slider input
  function updateVolume() {
    try {
      if (!player || !volumeControl || !volumeDisplay) return;

      // Parse and validate the volume value
      let volume = parseInt(volumeControl.value, 10);

      // Check if parsing succeeded
      if (isNaN(volume)) {
        MediaUtils.logError("Invalid volume value:", volumeControl.value);
        volume = 50; // Default to 50%
      }

      // Clamp to valid range (0-100)
      volume = Math.max(0, Math.min(100, volume));

      // Update the input if we changed the value
      if (volume !== parseInt(volumeControl.value, 10)) {
        volumeControl.value = volume;
      }

      // Apply volume to player and update display
      player.setVolume(volume);
      volumeDisplay.textContent = volume + "%";
    } catch (error) {
      MediaUtils.logError("Error updating volume:", error);
    }
  }

  // Cleanup function for removing event listeners
  function cleanupAudioControls() {
    if (audioController) {
      audioController.abort();
      audioController = null;
    }

    // Reset state
    controlsInitialized = false;
    player = null;
    isPlaying = false;
    playButton = null;
    volumeControl = null;
    volumeDisplay = null;

    if (window.Logger && window.Logger.debug) {
      window.Logger.debug("Audio controls cleanup completed");
    }
  }

  // Expose cleanup function globally for potential SPA usage
  if (window.MediaUtils) {
    window.MediaUtils.audioCleanup = cleanupAudioControls;
  }

  // Cleanup on page unload (for SPA scenarios)
  window.addEventListener("beforeunload", cleanupAudioControls);
})();
