import { enemies } from "../constants/constants.js";

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

const loadText = document.querySelector(".loading-text");
const container = document.querySelector(".container");

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
let load;
let intervalId;

function blurring() {
  load++;
  if (load > 99) {
    clearInterval(intervalId);
    showGame();
  }
  loadText.innerText = `${load}%`;
  loadText.style.opacity = scale(load, 0, 100, 1, 0);
  container.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`;
}

function showGame() {
  if (document.querySelector(".loading-container") != null) {
    document.querySelector(".loading-container").style.background = "none";
  }
}

function checkWindowSize() {
  container.style.filter = "";
  width = document.querySelector(".block").getBoundingClientRect().width;
  TILE_SIZE = width;
  resizePlayer(width);
  resizeEnemy(width);
}

export function checkResizing(){
    load = 0;
    intervalId = setInterval(blurring, 30);
    checkWindowSize();
}

window.addEventListener(
    "resize",
    debounce(() => {
        container.style.filter = "blur(0px)";
    }, 1500)
);

window.addEventListener("resize", checkWindowSize);

function resizePlayer(width) {
  const player = document.getElementById("player");
  player.style.width = width + "px";
  player.style.height = width + "px";
  player.style.backgroundSize = "" + width * 4 + "px " + width * 4 + "px";
  playerState.x = playerState.col * width;
  playerState.y = playerState.row * width;
  playerState.speed = width * 2;
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
