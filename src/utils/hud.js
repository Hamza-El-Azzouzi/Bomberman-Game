import { isPaused, gameOver } from "./pause_menu.js";

export let score;
export let lives;
let minutes;
let seconds;
let timer;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const timerElement = document.getElementById("timer");

export function setHud() {
  score = 0;
  lives = 5;
  minutes = 5;
  seconds = 60;
  timer = minutes * seconds + 3;
}

function updateHUD() {
  scoreElement.textContent = `Score: ${score}`;
  livesElement.textContent = `Lives: ${lives}`;
  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timerElement.textContent = "Timer: " + minutes + ":" + seconds;

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
  if (lives === 0) {
    gameOver();
  }
  updateHUD();
}
