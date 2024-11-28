// Import necessary modules and constants
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

const mapBounds = {
  width: 750,
  height: 650,
};

const activeKeys = [];
const frameInterval = 200;
let lastAnimationTime = 0;

const obstacles = [
  { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE },
  { x: 4 * TILE_SIZE, y: 2 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE },
];

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function updatePlayerPosition(playerState, deltaX, deltaY) {
  const futurePosition = {
    x: playerState.x + deltaX,
    y: playerState.y + deltaY,
    width: TILE_SIZE,
    height: TILE_SIZE,
  };

  futurePosition.x = Math.max(TILE_SIZE, Math.min(mapBounds.width - TILE_SIZE, futurePosition.x));
  futurePosition.y = Math.max(TILE_SIZE, Math.min(mapBounds.height - TILE_SIZE, futurePosition.y));


  const isBlocked = obstacles.some((obstacle) => isColliding(futurePosition, obstacle));

  if (!isBlocked) {
    playerState.x = futurePosition.x;
    playerState.y = futurePosition.y;
  }
}

// Update function for movement
export function update(deltaTime) {
  if (activeKeys.length === 0) {
    playerState.frame = 0;
    return;
  }

  const lastKey = activeKeys[activeKeys.length - 1];
  let deltaX = 0;
  let deltaY = 0;

  switch (lastKey) {
    case "ArrowUp":
    case "w":
      playerState.direction = "up";
      deltaY = -playerState.speed * deltaTime;
      break;
    case "ArrowDown":
    case "s":
      playerState.direction = "down";
      deltaY = playerState.speed * deltaTime;
      break;
    case "ArrowLeft":
    case "a":
      playerState.direction = "left";
      deltaX = -playerState.speed * deltaTime;
      break;
    case "ArrowRight":
    case "d":
      playerState.direction = "right";
      deltaX = playerState.speed * deltaTime;
      break;
  }

  updatePlayerPosition(playerState, deltaX, deltaY);

  if (deltaX !== 0 || deltaY !== 0) {
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
  player.style.transform = `translate3d(${Math.round(playerState.x)}px, ${Math.round(playerState.y)}px, 0)`;

  const row = spriteDirections[playerState.direction];
  player.style.backgroundPosition = `-${playerState.frame * frameWidth}px -${row * frameHeight}px`;
}

document.addEventListener(
  "keydown",
  (event) => {
    if (!activeKeys.includes(event.key)) {
      activeKeys.push(event.key);
    }
  },
  { passive: true }
);

document.addEventListener(
  "keyup",
  (event) => {
    const index = activeKeys.indexOf(event.key);
    if (index !== -1) {
      activeKeys.splice(index, 1);
    }
  },
  { passive: true }
);

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    placeBomb(playerState);
  }
});
