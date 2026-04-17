---
layout: default
title: Wiki
---

<!-- 🔥 Flame Canvas -->
<canvas id="flame-canvas"></canvas>
<div id="flame-overlay"></div>

<style>
#flame-canvas {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  image-rendering: pixelated;
}

#flame-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5, 0, 0, 0.80) 0%,
    rgba(5, 0, 0, 0.50) 55%,
    rgba(5, 0, 0, 0.08) 100%
  );
  z-index: -1;
  pointer-events: none;
}
</style>

# Wiki

This "wiki" is more of a collection of snippets and code blocks for people to use as reference. User beware. No guarantees, express or implied, regarding specific outcomes or results can be expected by using anything you find here.

<ul>
  {% for page in site.pages %}
    {% if page.path contains 'wiki/' and page.name != 'index.md' %}
      <li>
        <a href="{{ page.url | relative_url }}">
          {{ page.title | default: page.name | replace: '.md', '' }}
        </a>
      </li>
    {% endif %}
  {% endfor %}
</ul>

<script>
const canvas = document.getElementById('flame-canvas');
const ctx = canvas.getContext('2d');

const palette = [
  [0,0,0],[7,0,0],[15,0,0],[23,0,0],[31,0,0],[39,0,0],[47,0,0],
  [55,0,0],[63,0,0],[71,0,0],[79,0,0],[87,0,0],[95,0,0],[103,0,0],
  [111,0,0],[119,0,0],[127,0,0],[135,7,0],[143,15,0],[151,23,0],
  [159,31,0],[167,39,0],[175,47,0],[183,55,0],[191,63,0],[199,71,0],
  [207,79,0],[215,87,0],[223,95,0],[231,103,0],[239,111,0],[247,119,0],
  [255,127,0],[255,135,7],[255,143,15],[255,151,23],[255,159,31],
  [255,167,39],[255,175,47],[255,183,55],[255,191,63],[255,199,71],
  [255,207,79],[255,215,87],[255,223,95],[255,231,103],[255,239,111],
  [255,247,119],[255,255,127],[255,255,143],[255,255,159],[255,255,175],
  [255,255,191],[255,255,207],[255,255,223],[255,255,239],[255,255,255]
];

const PIXEL = 8;
let cols, rows, fire;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.ceil(canvas.width / PIXEL);
  rows = Math.ceil(canvas.height / PIXEL);
  fire = new Uint8Array(cols * rows);

  for (let x = 0; x < cols; x++) {
    fire[(rows - 1) * cols + x] = palette.length - 1;
  }
}

function spread() {
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols; x++) {
      const below = fire[(y + 1) * cols + x];
      if (below === 0) {
        fire[y * cols + x] = 0;
      } else {
        const decay = Math.floor(Math.random() * 3);
        const drift = Math.floor(Math.random() * 3) - 1;
        const nx = Math.max(0, Math.min(cols - 1, x - drift));
        fire[y * cols + nx] = Math.max(0, below - decay);
      }
    }
  }
}

function draw() {
  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const d = imgData.data;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const val = fire[y * cols + x];
      const [r, g, b] = palette[val];

      for (let py = 0; py < PIXEL; py++) {
        const ry = y * PIXEL + py;
        if (ry >= canvas.height) continue;

        for (let px = 0; px < PIXEL; px++) {
          const rx = x * PIXEL + px;
          if (rx >= canvas.width) continue;

          const i = (ry * canvas.width + rx) * 4;
          d[i] = r;
          d[i + 1] = g;
          d[i + 2] = b;
          d[i + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

window.addEventListener('resize', resize);
resize();

(function loop() {
  spread();
  draw();
  setTimeout(() => requestAnimationFrame(loop), 80);
})();
</script>