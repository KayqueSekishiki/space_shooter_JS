const yourShip = document.querySelector(".player-shooter");
const playArea = document.querySelector("#main-play-area");
const aliensImg = [
  "img/monster-1.png",
  "img/monster-2.png",
  "img/monster-3.png",
];
const instructionsText = document.querySelector(".game-instructions");
const startButton = document.querySelector(".start-button");
const score = document.querySelector(".score");
let scoreValue = 0;
let alienInterval;
let respawTime = 2000;

function flyShip(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveUp();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveDown();
  } else if (event.key === " ") {
    event.preventDefault();
    fireLaser();
  }
}

function moveUp() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
  if (topPosition === "50px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position -= 50;
    yourShip.style.top = `${position}px`;
  }
}

function moveDown() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
  if (topPosition === "500px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position += 50;
    yourShip.style.top = `${position}px`;
  }
}

function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(
    window.getComputedStyle(yourShip).getPropertyValue("left")
  );
  let yPosition = parseInt(
    window.getComputedStyle(yourShip).getPropertyValue("top")
  );
  let newLaser = document.createElement("img");
  newLaser.src = "img/shoot.png";
  newLaser.classList.add("laser");
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;
  return newLaser;
}

function moveLaser(laser) {
  setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll(".alien");

    aliens.forEach((alien) => {
      if (checkLaserCollision(laser, alien)) {
        alien.src = "img/explosion.png";
        alien.classList.remove("alien");
        alien.classList.add("dead-alien");
      }
    });

    if (xPosition === 340) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

function createAliens() {
  let newAlien = document.createElement("img");
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
  newAlien.src = alienSprite;
  newAlien.classList.add("alien");
  newAlien.classList.add("alien-transition");
  newAlien.style.left = "370px";
  newAlien.style.top = `${Math.floor(Math.random() * 10 + 1) * 50}px`;
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

function moveAlien(alien) {
  setInterval(() => {
    let xPosition = parseInt(
      window.getComputedStyle(alien).getPropertyValue("left")
    );
    if (xPosition <= 0) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${xPosition - 4}px`;
    }
  }, 30);
}

function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 30;
  if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
    if (laserTop <= alienTop && laserTop >= alienBottom) {
      let randomEnemyScore = Math.floor(Math.random() * 4 + 1) * 50;
      console.log(randomEnemyScore);
      updateScore(randomEnemyScore);
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function updateScore(value) {
  scoreValue += value;
  let formattedScore = scoreValue.toString().padStart(5, "0");
  score.innerHTML = `Score: ${formattedScore}`;
  increaseDifficult();
}

function increaseDifficult() {
  if (scoreValue >= 1500 && scoreValue <= 3000) {
    respawTime = 1000;
  } else if (scoreValue > 3000) {
    respawTime = 500;
  } else {
    respawTime = 2000;
  }

  updatealienInterval();
}

startButton.addEventListener("click", (event) => {
  playGame();
});

function playGame() {
  startButton.style.display = "none";
  instructionsText.style.display = "none";
  window.addEventListener("keydown", flyShip);
  updatealienInterval();
}

function updatealienInterval() {
  clearInterval(alienInterval);
  alienInterval = setInterval(() => {
    createAliens();
  }, respawTime);
}

function gameOver() {
  window.removeEventListener("keydown", flyShip);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll(".alien");
  aliens.forEach((alien) => alien.remove());
  let lasers = document.querySelectorAll(".laser");
  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    alert("game over!");
    yourShip.style.top = "250px";
    startButton.style.display = "block";
    instructionsText.style.display = "block";
  });
}
