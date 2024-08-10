---
layout: audiograph
title: Dashboard
permalink: "/audiograph/1/index.html"
meta: "A photo and a song, number one."
---

<style>
  /* shame, shame, I know your name */
  .control-panel {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .bind {
    display: flex;
    gap: 20px;
  }
  #playPauseBtn {
    font-size: 18px;
    padding: 10px 20px;
    cursor: pointer;
  }
  #volumeControl {
    width: 100px;
  }
  figure {
    margin-block: 0;
    margin-inline: 0;
    position: relative;
  }
  .contain {
    position: relative;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 1rem;
    text-align: left;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  .caption {
    color: white;
  }
  h1 {margin-block: 0;}
  .blur {
    color: transparent;
    text-shadow: 0 0 0.05rem rgba(255,255,255,0.95);
  }
  dd, dt {
    display: inline-block;
    margin-block: 0;
    margin-inline: 0;
  }
  dd {
    margin-inline-end: 0.5rem;
  }
  dt {
    color: var(--background-accent);
  }
  @media screen and (width >= 48em) {
  .contain {
    position: absolute;
    top: 0;
    right: 0;
    max-width: 40ch;
  }
}
</style>

<!-- CSS workaround ↓ -->
<div role="main" id="content" tabindex="-1">
  <div class="audiograph">
    <h1 class="sr">A photo and a song, number one.<h1>
    {% picture "dashboard", "jpg", "240", "320", "1600", "Late night dashboard glow. Image description follows.", "" %}
    <div class="contain">
      <p class="caption">The neon blue and orange glow from a Volkwagen Rabbit dashboard as seen from the passenger seat. The needles of the gauges are <span class="blur">blurry</span>. The steering wheel in the center of the frame is without a hand. The song that follows plays aloud.</p>
      <dl>
        <dt>Artist:</dt>
        <dd>M83</dd>
        <dt>Song:</dt>
        <dd><em>Kim and Jessie</em></dd>
        <dt>Album:</dt>
        <dd>Saturdays = Youth</dd>
      </dl>
      <div id="player" style="display: none;" data-video-id="n5cgzcjqOtE"></div>
      <div class="control-panel">
        <button id="playPauseBtn">Play</button>
        <div class="bind">
          <input type="range" id="volumeControl" min="0" max="100" value="75">
          <label for="volumeControl">Volume</label>
          <span id="volumeDisplay">75%</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src =
    "https://www.youtube.com/iframe_api";
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
        controls: 0
      },
      events: {
        onReady: onPlayerReady
      }
    });
  }

  function onPlayerReady(event) {
    const playPauseBtn = document.getElementById("playPauseBtn");
    playPauseBtn.addEventListener("click", togglePlayPause);

    const volumeControl = document.getElementById("volumeControl");
    volumeControl.addEventListener("input", updateVolume);

    // Set initial volume
    updateVolume();
  }

  function togglePlayPause() {
    if (isPlaying) {
      player.pauseVideo();
      document.getElementById("playPauseBtn").textContent = "Play";
    } else {
      player.playVideo();
      document.getElementById("playPauseBtn").textContent = "Pause";
    }
    isPlaying = !isPlaying;
  }

  function updateVolume() {
    const volumeControl = document.getElementById("volumeControl");
    const volumeDisplay = document.getElementById("volumeDisplay");
    const volume = volumeControl.value;

    player.setVolume(volume);
    volumeDisplay.textContent = volume + "%";
  }
</script>
