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

const frameInterval = 200;
let lastAnimationTime = 0;

export function update(deltaTime) {
  const threshold = Math.round(TILE_SIZE / 1.9); // Alignment threshold
  let moving = false;

  playerState.prevX = playerState.x;
  playerState.prevY = playerState.y;

  let row, col;
  const speed = Math.round(playerState.speed * deltaTime);

  // Up movement
  if (keys.ArrowUp || keys.w) {
    playerState.direction = "up";
    row = Math.ceil(playerState.y / TILE_SIZE);
    col = Math.floor(playerState.x / TILE_SIZE);

    if (utils.checkSurroundings(row, col, Tils).up) {
      if (Math.abs(playerState.x % TILE_SIZE) < threshold) {
        playerState.y -= speed;
        playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE; // Snap to column
      }
      moving = true;
    }
  }

  // Down movement
  if (keys.ArrowDown || keys.s) {
    playerState.direction = "down";
    row = Math.floor(playerState.y / TILE_SIZE);
    col = Math.floor(playerState.x / TILE_SIZE);

    if (utils.checkSurroundings(row, col, Tils).down) {
      if (Math.abs(playerState.x % TILE_SIZE) < threshold) {
        playerState.y += speed;
        playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE; // Snap to column
      }
      moving = true;
    }
  }

  // Left movement
  if (keys.ArrowLeft || keys.a) {
    playerState.direction = "left";
    row = Math.floor(playerState.y / TILE_SIZE);
    col = Math.floor(playerState.x / TILE_SIZE);

    if (utils.checkSurroundings(row, col, Tils).left) {
      if (Math.abs(playerState.y % TILE_SIZE) < threshold) {
        playerState.x -= speed;
        playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE; // Snap to row
      }
      moving = true;
    }
  }

  // Right movement
  if (keys.ArrowRight || keys.d) {
    playerState.direction = "right";
    row = Math.floor(playerState.y / TILE_SIZE);
    col = Math.floor(playerState.x / TILE_SIZE);

    if (utils.checkSurroundings(row, col, Tils).right) {
      if (Math.abs(playerState.y % TILE_SIZE) < threshold) {
        playerState.x += speed;
        playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE; // Snap to row
      }
      moving = true;
    }
  }

  // Ensure player stays within bounds
  playerState.x = Math.max(TILE_SIZE, Math.min(mapBounds.width - TILE_SIZE * 2, playerState.x));
  playerState.y = Math.max(TILE_SIZE, Math.min(mapBounds.height - TILE_SIZE * 2, playerState.y));

  // Update last move direction
  if (playerState.y > playerState.prevY) {
    playerState.lastMove = "up-to-down";
  } else if (playerState.y < playerState.prevY) {
    playerState.lastMove = "down-to-up";
  } else if (playerState.x > playerState.prevX) {
    playerState.lastMove = "left-to-right";
  } else if (playerState.x < playerState.prevX) {
    playerState.lastMove = "right-to-left";
  }

  // Handle animation frames
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
