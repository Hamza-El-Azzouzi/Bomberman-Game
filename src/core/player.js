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
  prevX: 0,
  prevY: 0,
  speed: 150,
  direction: "down",
  lastMove: "up-to-down",
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

const activeKeys = [];
const frameInterval = 200;
let lastAnimationTime = 0;

export function update(deltaTime) {
  if (activeKeys.length === 0) {
    playerState.frame = 0;
    return;
  }

  const lastKey = activeKeys[activeKeys.length - 1];
  const threshold = TILE_SIZE / 2.5;
  let moving = false;

  playerState.prevX = playerState.x;
  playerState.prevY = playerState.y;

  console.log("Last Move:", playerState.lastMove);

  let row, col,surroundings;

  switch (lastKey) {
    case "ArrowUp":
    case "w":
      playerState.direction = "up";
      row = Math.ceil(playerState.y / TILE_SIZE);
      if (playerState.lastMove === "left-to-right") {
        col = Math.ceil(playerState.x / TILE_SIZE);
      } else if (playerState.lastMove === "right-to-left") {
        col = Math.floor(playerState.x / TILE_SIZE);
      } else {
        col = Math.round(playerState.x / TILE_SIZE);
      }
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.up) {
        if (playerState.lastMove === "left-to-right") {
          if (playerState.x % TILE_SIZE > threshold) {
            playerState.y -= Math.round(playerState.speed * deltaTime);
            playerState.x = Math.ceil(playerState.x / TILE_SIZE) * TILE_SIZE;
          }
        } else if (playerState.lastMove === "right-to-left") {
          if (playerState.x % TILE_SIZE < threshold) {
            playerState.y -= Math.round(playerState.speed * deltaTime);
            playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE;
          }
        } else {
          playerState.y -= Math.round(playerState.speed * deltaTime);
        }
      }
      moving = true;
      break;
    case "ArrowDown":
    case "s":
      playerState.direction = "down";
      row = Math.floor(playerState.y / TILE_SIZE);
      if (playerState.lastMove === "left-to-right") {
        col = Math.ceil(playerState.x / TILE_SIZE);
      } else if (playerState.lastMove === "right-to-left") {
        col = Math.floor(playerState.x / TILE_SIZE);
      } else {
        col = Math.round(playerState.x / TILE_SIZE);
      }
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.down) {
        if (playerState.lastMove === "left-to-right") {
          if (playerState.x % TILE_SIZE > threshold) {
            playerState.y += Math.round(playerState.speed * deltaTime);
            playerState.x = Math.ceil(playerState.x / TILE_SIZE) * TILE_SIZE;
          }
        } else if (playerState.lastMove === "right-to-left") {
          if (playerState.x % TILE_SIZE < threshold) {
            playerState.y += Math.round(playerState.speed * deltaTime);
            playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE;
          }
        } else {
          playerState.y += Math.round(playerState.speed * deltaTime);
        }
      }
      moving = true;
      break;
    case "ArrowLeft":
    case "a":
      playerState.direction = "left";
      if (playerState.lastMove === "up-to-down") {
        row = Math.ceil(playerState.y / TILE_SIZE);
      } else if (playerState.lastMove === "down-to-up") {
        row = Math.floor(playerState.y / TILE_SIZE);
      } else {
        row = Math.round(playerState.y / TILE_SIZE);
      }
      col = Math.ceil(playerState.x / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.left) {
        if (playerState.lastMove === "up-to-down") {
          if (playerState.y % TILE_SIZE > threshold) {
            playerState.y = Math.ceil(playerState.y / TILE_SIZE) * TILE_SIZE;
          }
          playerState.x -= Math.round(playerState.speed * deltaTime);
        } else if (playerState.lastMove === "down-to-up") {
          if (playerState.y % TILE_SIZE < threshold) {
            playerState.x -= Math.round(playerState.speed * deltaTime);
            playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE;
          }
        } else {
          playerState.x -= Math.round(playerState.speed * deltaTime);
        }
      }
      moving = true;
      break;
    case "ArrowRight":
    case "d":
      playerState.direction = "right";
      if (playerState.lastMove === "up-to-down") {
        row = Math.ceil(playerState.y / TILE_SIZE);
      } else if (playerState.lastMove === "down-to-up") {
        row = Math.floor(playerState.y / TILE_SIZE);
      } else {
        row = Math.round(playerState.y / TILE_SIZE);
      }
      col = Math.floor(playerState.x / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.right) {
        if (playerState.lastMove === "up-to-down") {
          if (playerState.y % TILE_SIZE > threshold) {
            playerState.y = Math.ceil(playerState.y / TILE_SIZE) * TILE_SIZE;
          }
          playerState.x += Math.round(playerState.speed * deltaTime);
        } else if (playerState.lastMove === "down-to-up") {
          if (playerState.y % TILE_SIZE < threshold) {
            playerState.x += Math.round(playerState.speed * deltaTime);
            playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE;
          }
        } else {
          playerState.x += Math.round(playerState.speed * deltaTime);
        }
      }
      moving = true;
      break;
  }

  playerState.x = Math.max(
    TILE_SIZE,
    Math.min(mapBounds.width - TILE_SIZE * 2, playerState.x)
  );
  playerState.y = Math.max(
    TILE_SIZE,
    Math.min(mapBounds.height - TILE_SIZE * 2, playerState.y)
  );

  if (playerState.y > playerState.prevY) {
    playerState.lastMove = "up-to-down";
  } else if (playerState.y < playerState.prevY) {
    playerState.lastMove = "down-to-up";
  } else if (playerState.x > playerState.prevX) {
    playerState.lastMove = "left-to-right";
  } else if (playerState.x < playerState.prevX) {
    playerState.lastMove = "right-to-left";
  }

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

document.addEventListener('keydown', (event) => {
  if (!activeKeys.includes(event.key)) {
      activeKeys.push(event.key);
  }
}, { passive: true });

document.addEventListener('keyup', (event) => {
  const index = activeKeys.indexOf(event.key);
  if (index !== -1) {
      activeKeys.splice(index, 1);
  }
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    placeBomb(playerState);
  }
});
