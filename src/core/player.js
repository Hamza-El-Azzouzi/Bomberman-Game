import { placeBomb } from "./bomb.js";
import * as utils from "../utils/collision.js";
import { Tils } from "../main.js";
const TILE_SIZE = 50;
const player = document.getElementById("player");
const frameWidth = 50;
const frameHeight = 50;
const spriteDirections = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

export const playerState = {
  x: 0,
  y: 0,
  speed: 150,
  direction: "down",
  frame: 0,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

const mapBounds = {
  width: 750,
  height: 650,
};

const frameInterval = 200;
let lastAnimationTime = 0;

export function update(deltaTime) {
  const surroundings = utils.checkSurroundings(playerState, Tils, TILE_SIZE);
  const threshold = TILE_SIZE / 10;
  let moving = false;

  if (keys.ArrowUp || keys.w) {
    playerState.direction = "up";
    if (Math.abs(playerState.x % TILE_SIZE) < threshold && surroundings.up) {
      playerState.y -= Math.round(playerState.speed * deltaTime);
      playerState.y = Math.round(playerState.y / 5) * 5;
      playerState.x = Math.round(playerState.x / TILE_SIZE) * TILE_SIZE;
      playerState.x = Math.round(playerState.x / 5) * 5;
    }
    moving = true;
  }
  if (keys.ArrowDown || keys.s) {
    playerState.direction = "down";
    if (Math.abs(playerState.x % TILE_SIZE) < threshold && surroundings.down) {
      playerState.y += Math.round(playerState.speed * deltaTime);
      playerState.y = Math.round(playerState.y / 5) * 5;
      playerState.x = Math.round(playerState.x / TILE_SIZE) * TILE_SIZE;
      playerState.x = Math.round(playerState.x / 5) * 5;
    }
    moving = true;
  }
  if (keys.ArrowLeft || keys.a) {
    playerState.direction = "left";
    if (Math.abs(playerState.y % TILE_SIZE) < threshold && surroundings.left) {
      playerState.x -= Math.round(playerState.speed * deltaTime);
      playerState.x = Math.round(playerState.x / 5) * 5;
      playerState.y = Math.round(playerState.y / TILE_SIZE) * TILE_SIZE;
      playerState.y = Math.round(playerState.y / 5) * 5;
    }
    moving = true;
  }
  if (keys.ArrowRight || keys.d) {
    playerState.direction = "right";
    if (Math.abs(playerState.y % TILE_SIZE) < threshold && surroundings.right) {
      playerState.x += Math.round(playerState.speed * deltaTime);
      playerState.x = Math.round(playerState.x / 5) * 5;

      playerState.y = Math.round(playerState.y / TILE_SIZE) * TILE_SIZE;
      playerState.y = Math.round(playerState.y / 5) * 5;
    }
    moving = true;
  }

  playerState.x = Math.max(
    TILE_SIZE,
    Math.min(mapBounds.width - TILE_SIZE, playerState.x)
  );
  playerState.y = Math.max(
    TILE_SIZE,
    Math.min(mapBounds.height - TILE_SIZE, playerState.y)
  );

  if (moving) {
    const currentTime = performance.now();
    if (currentTime - lastAnimationTime > frameInterval) {
      playerState.frame = (playerState.frame + 1) % 4;
      lastAnimationTime = currentTime;
    }
  } else {
    playerState.frame = 0;
  }
}

export function render() {
  player.style.transform = `translate3d(${Math.round(
    playerState.x
  )}px, ${Math.round(playerState.y)}px, 0)`;

  const row = spriteDirections[playerState.direction];
  player.style.backgroundPosition = `-${playerState.frame * frameWidth}px -${
    row * frameHeight
  }px`;
}

function handleKeydown(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
  }
}

function handleKeyup(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
}

document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    placeBomb(playerState);
  }
});
