const canvas = document.getElementById("fire");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth / 4;
  canvas.height = window.innerHeight / 4;
}
resize();
window.addEventListener("resize", resize);

let firePixels;
const fireColors = [
  "#000000", "#330000", "#660000", "#990000",
  "#cc3300", "#ff6600", "#ff9900", "#ffff00", "#ffffff"
];

function initFire() {
  firePixels = new Array(canvas.width * canvas.height).fill(0);
  for (let x = 0; x < canvas.width; x++) {
    firePixels[(canvas.height - 1) * canvas.width + x] = fireColors.length - 1;
  }
}

function updateFire() {
  for (let i = 0; i < firePixels.length; i++) {
    let below = i + canvas.width;
    if (below < firePixels.length) {
      let decay = Math.floor(Math.random() * 3);
      let newVal = firePixels[below] - decay;
      firePixels[i - decay >= 0 ? i - decay : 0] = newVal < 0 ? 0 : newVal;
    }
  }
}

function drawFire() {
  for (let i = 0; i < firePixels.length; i++) {
    let x = i % canvas.width;
    let y = Math.floor(i / canvas.width);
    ctx.fillStyle = fireColors[firePixels[i]];
    ctx.fillRect(x, y, 1, 1);
  }
}

function loop() {
  updateFire();
  drawFire();
  requestAnimationFrame(loop);
}

initFire();
loop();