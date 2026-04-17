---
layout: home
title: Home
---

<img id="cursor-gif" src="assets/DOGGYDOG.gif" alt="cursor follower" />

<script>
  const cursorGif = document.getElementById("cursor-gif");
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let posX = mouseX, posY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateFollower() {
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;
    cursorGif.style.left = posX + "px";
    cursorGif.style.top = posY + "px";
    requestAnimationFrame(animateFollower);
  }

  animateFollower();
</script>