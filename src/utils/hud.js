import { isPaused,gameOver } from "./pause_menu.js";

let score = 0;
let lives = 0;
let minutes = 0;
let seconds = 0;
let timer = 0;

const container = document.querySelector(".container");
const hudDiv = document.createElement("div");
const scoreElement = document.createElement("div");
const livesElement = document.createElement("div");
const timerElement = document.createElement("div");

export function initHud() {
  score = 0;
  lives = 5;
  minutes = 5;
  seconds = 60;
  timer = minutes*seconds;
  hudDiv.id = "hud";
  scoreElement.id = "score";
  scoreElement.textContent = "Score: 0";
  livesElement.id = "lives";
  livesElement.textContent = "Lives: 5";
  timerElement.id = "timer";
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  timerElement.textContent = "game ends in: 05:00";
  hudDiv.appendChild(scoreElement);
  hudDiv.appendChild(livesElement);
  hudDiv.appendChild(timerElement);
  container.appendChild(hudDiv);
}

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

let intervalId = setInterval(() => {
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
  if (lives === 0){
    gameOver();
  }
  updateHUD();
}
