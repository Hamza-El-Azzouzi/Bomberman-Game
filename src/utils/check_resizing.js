import { enemies } from "../constants/constants.js";
import { pauseGame } from "./pause_menu.js";

export let TILE_SIZE = 50;

export const playerState = {
  x: TILE_SIZE,
  y: TILE_SIZE,
  row: 1,
  col: 1,
  speed: 100,
  direction: "down",
  frame: 0,
  isDying: false,
};

let width;

// window.addEventListener("blur", () => {
//   const enemiesElements = document.querySelectorAll(".enemy");
//   for (const enemy of enemiesElements) {
//     enemy.style.display = "none";
//   }
// });

// window.addEventListener(
//   "focus",
//   debounce(() => {
//     const enemiesElements = document.querySelectorAll(".enemy");
//     for (const enemy of enemiesElements) {
//       enemy.style.display = "none";
//     }
//   }, 200)
// );

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function checkResizing() {
  document.addEventListener("DOMContentLoaded", () => {
    function checkWindowSize() {
      width = document.querySelector(".block").getBoundingClientRect().width;
      TILE_SIZE = width;
      resizePlayer(width);
      resizeEnemy(width);
    }
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
  });
}

function resizePlayer(width) {
  const player = document.getElementById("player");
  player.style.width = width + "px";
  player.style.height = width + "px";
  player.style.backgroundSize = "" + width * 4 + "px " + width * 4 + "px";
  playerState.x = playerState.col * width;
  playerState.y = playerState.row * width;
  playerState.speed = width *2; 
}

function resizeEnemy(width) {
  const enemiesElements = document.querySelectorAll(".enemy");
  for (const enemy of enemiesElements) {
    enemy.style.width = width + "px";
    enemy.style.height = width + "px";
    enemy.style.backgroundSize = "" + width * 4 + "px " + width * 4 + "px";
  }
  enemies.forEach((enemy) => {
    enemy.x = enemy.col * width;
    enemy.y = enemy.row * width;
  });
}
