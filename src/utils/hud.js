import { isPaused, gameOver } from "./pause_menu.js";

export let score;
export let lives;
let minutes;
let seconds;
let milliseconds;
let timer;
let startTime;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const timerElement = document.getElementById("timer");

export function setHud() {
  score = 0;
  lives = 5;
  minutes = 5;
  seconds = 0;
  timer = (minutes * 60 + seconds) * 1000 + 3000;
  startTime = Date.now();
}

function updateHUD() {
  scoreElement.textContent = `Score: ${score}`;
  livesElement.textContent = `Lives: ${lives}`;
  
  const elapsed = Date.now() - startTime; 
  const remainingTime = timer - elapsed;

  if (remainingTime <= 0) {
    timerElement.textContent = "Timer: 00:00:000";
    gameOver();
    return;
  }

  minutes = Math.floor(remainingTime / 60000);
  seconds = Math.floor((remainingTime % 60000) / 1000); 
  milliseconds = remainingTime % 1000; 

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milliseconds = milliseconds < 100 ? "0" + milliseconds : milliseconds; 

  timerElement.innerHTML = `Timer: ${minutes}:${seconds}<span hidden>:${milliseconds}</span>`;
}

setInterval(() => {
  if (!isPaused) {
    updateHUD();
  }
}, 1);


// export function setHud() {
//   score = 0;
//   lives = 5;
//   minutes = 5;
//   seconds = 60;
//   timer = minutes * seconds * 1000;
// }

// function updateHUD() {
//   scoreElement.textContent = `Score: ${score}`;
//   livesElement.textContent = `Lives: ${lives}`;
//   minutes = parseInt(timer / 60000, 10);
//   seconds = parseInt(timer % 60, 10);

//   minutes = minutes < 10 ? "0" + minutes : minutes;
//   seconds = seconds < 10 ? "0" + seconds : seconds;
//   const milliseconds = Math.floor((timer % 1000) / 10);
//   // timerElement.textContent = "Timer: " + minutes + ":" + seconds;
//   timerElement.textContent = `Time: ${minutes.toString().padStart(2, "0")}:${seconds
//     .toString()
//     .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;

//   if (timer === 0) {
//     gameOver();
//   }
// }

// setInterval(() => {
//   if (!isPaused) {
//     timer -= 10;
//     updateHUD();
//   }
// }, 10);

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
