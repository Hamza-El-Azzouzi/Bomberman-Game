import { isPaused } from "./pause_menu.js";

let score = 0;
let lives = 5;
let timer = 0;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const timerElement = document.getElementById("timer");

function updateHUD() {
  scoreElement.textContent = `Score: ${score}`;
  livesElement.textContent = `Lives: ${lives}`;
  timerElement.textContent = `Time: ${Math.floor(timer)}`;
}

setInterval(() => {
  if (!isPaused) {
    timer += 1;
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
