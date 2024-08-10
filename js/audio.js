let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(script);

let player;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
  const playerElement = document.getElementById("player");
  const videoId = playerElement.getAttribute("data-video-id");

  player = new YT.Player("player", {
    height: "0",
    width: "0",
    videoId: videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
    },
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  const playPauseBtn = document.getElementById("play-pause-btn");
  playPauseBtn.addEventListener("click", togglePlayPause);

  const volumeControl = document.getElementById("volume-control");
  volumeControl.addEventListener("input", updateVolume);

  // Set initial volume
  updateVolume();
}

function togglePlayPause() {
  if (isPlaying) {
    player.pauseVideo();
    document.getElementById("play-pause-btn").textContent = "Play";
  } else {
    player.playVideo();
    document.getElementById("play-pause-btn").textContent = "Pause";
  }
  isPlaying = !isPlaying;
}

function updateVolume() {
  const volumeControl = document.getElementById("volume-control");
  const volumeDisplay = document.getElementById("volume-display");
  const volume = volumeControl.value;

  player.setVolume(volume);
  volumeDisplay.textContent = volume + "%";
}
