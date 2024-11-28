// Import necessary modules and constants
import { placeBomb } from "./bomb.js";
import * as utils from "../utils/collision.js";
import { Tils } from "../main.js";

const TILE_SIZE = 50;
const player = document.getElementById("player");
const frameWidth = 48;
const frameHeight = 48;

const spriteDirections = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

export const playerState = {
  x: 0,
  y: 0,
  speed: 200,
  direction: 'down',
  frame: 0,
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
  width: 750,
  height: 650,
};

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
  const surroundings = utils.checkSurroundings(playerState, Tils, TILE_SIZE);
  const threshold = TILE_SIZE / 20;
  let moving = false;

  if (keys.ArrowUp || keys.w) {
    playerState.direction = "up";
    if (
      Math.abs(playerState.x % TILE_SIZE) < threshold &&
      surroundings.up
    ) {
      playerState.y -= playerState.speed * deltaTime;
      playerState.x = Math.round(playerState.x / TILE_SIZE) * TILE_SIZE;
    }
    moving = true;
  }
  if (keys.ArrowDown || keys.s) {
    playerState.direction = "down";
    if (
      Math.abs(playerState.x % TILE_SIZE) < threshold &&
      surroundings.down
    ) {
      playerState.y += playerState.speed * deltaTime;
      playerState.x = Math.round(playerState.x / TILE_SIZE) * TILE_SIZE;
    }
    moving = true;
  }
  if (keys.ArrowLeft || keys.a) {
    playerState.direction = "left";
    if (
      Math.abs(playerState.y % TILE_SIZE) < threshold &&
      surroundings.left
    ) {
      playerState.x -= playerState.speed * deltaTime;
      playerState.y = Math.round(playerState.y / TILE_SIZE) * TILE_SIZE;

    }
    moving = true;
  }
  if (keys.ArrowRight || keys.d) {
    playerState.direction = "right";
    if (
      Math.abs(playerState.y % TILE_SIZE) < threshold &&
      surroundings.right
    ) {
      playerState.x += playerState.speed * deltaTime;
      playerState.y = Math.round(playerState.y / TILE_SIZE) * TILE_SIZE;
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
    playerState.frame = 0;
  }
}



export function render() {
  player.style.transform = `translate3d(${Math.round(playerState.x)}px, ${Math.round(playerState.y)}px, 0)`;
  player.style.transform = `translate3d(${Math.round(playerState.x)}px, ${Math.round(playerState.y)}px, 0)`;

  let row = spriteDirections[playerState.direction];
  player.style.backgroundPosition = `-${playerState.frame * frameWidth}px -${row * frameHeight}px`;
  row = spriteDirections[playerState.direction];
  player.style.backgroundPosition = `-${playerState.frame * frameWidth}px -${row * frameHeight}px`;
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

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    placeBomb(playerState);
  }
  if (event.key === " ") {
    event.preventDefault();
    placeBomb(playerState);
  }
});
