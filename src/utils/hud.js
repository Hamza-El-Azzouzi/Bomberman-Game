import { isPaused } from "./pause_menu.js";

let score = 0;
let lives = 5;
let minutes = 5;
let seconds = 60;
let timer = minutes * seconds;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const timerElement = document.getElementById("timer");

function updateHUD() {
  scoreElement.textContent = `Score: ${score}`;
  livesElement.textContent = `Lives: ${lives}`;
  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timerElement.textContent = "game ends in: " + minutes + ":" + seconds;

  if (timer === 0) {
    gameOver();
  }
}

setInterval(() => {
  if (!isPaused) {
    timer -= 1;
    updateHUD();
  }
}, 1000);

export function increaseScore(amount) {
  score += amount;
  updateHUD();
}

export function decreaseLives() {
  lives -= 1;
  updateHUD();
}