import { Tils } from "../main.js";
import { spriteDirections } from "../constants/constants.js";
import { TILE_SIZE, playerState } from "../utils/check_resizing.js";
import { placeBomb } from "./bomb.js";
import * as utils from "../utils/collision.js";
import { bombX, bombY } from "./bomb.js";
import { decreaseLives, lives } from "../utils/hud.js";
import { checkSurroundingsPlayerByEnemy } from "../utils/collision.js";
let player;

const activeKeys = [];
const frameInterval = 150;
let lastAnimationTime = 0;

export function killPlayer() {
  playerState.isDying = true;
  player.classList.add("player-death");
  player.addEventListener("animationend", () => {
    resetPlayer();
  });
  decreaseLives();
}

export function resetPlayer() {
  playerState.isDying = false;
  playerState.x = TILE_SIZE;
  playerState.y = TILE_SIZE;
  playerState.col = 1;
  playerState.row = 1;
  playerState.direction = "down";
  playerState.frame = 0;
  player.classList.remove("player-death");
}

export function update(deltaTime) {
  if (playerState.isDying) return;
  const surroundingPlayerByEnemy = checkSurroundingsPlayerByEnemy(
    
  );
  if (Object.values(surroundingPlayerByEnemy).some((item) => item)) {
    killPlayer();
  }

  player = document.getElementById("player");
  if (activeKeys.length === 0) {
    playerState.frame = 0;
    return;
  }

  const lastKey = activeKeys[activeKeys.length - 1];
  const threshold = TILE_SIZE / 2;
  let moving = false;

  let row, col, surroundings;

  if (playerState.x % TILE_SIZE > threshold) {
    col = Math.ceil(playerState.x / TILE_SIZE);
  } else {
    col = Math.floor(playerState.x / TILE_SIZE);
  }
  if (playerState.y % TILE_SIZE > threshold) {
    row = Math.ceil(playerState.y / TILE_SIZE);
  } else {
    row = Math.floor(playerState.y / TILE_SIZE);
  }

  const isBlockedByBomb = () => {
    return (
      bombX === Math.round(playerState.x / TILE_SIZE) &&
      bombY === Math.round(playerState.y / TILE_SIZE)
    );
  };
  switch (lastKey) {
    case "ArrowUp":
    case "w":
      playerState.direction = "up";
      row = Math.ceil(playerState.y / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.up || (Tils[row - 1][col] === 7 && isBlockedByBomb())) {
        if (playerState.x % TILE_SIZE > threshold) {
          playerState.x = Math.ceil(playerState.x / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE;
        }
        playerState.y -= playerState.speed * deltaTime;
      }
      moving = true;
      break;
    case "ArrowDown":
    case "s":
      playerState.direction = "down";
      row = Math.floor(playerState.y / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (
        surroundings.down ||
        (Tils[row + 1][col] === 7 && isBlockedByBomb())
      ) {
        if (playerState.x % TILE_SIZE > threshold) {
          playerState.x = Math.ceil(playerState.x / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE;
        }
        playerState.y += playerState.speed * deltaTime;
      }
      moving = true;
      break;
    case "ArrowLeft":
    case "a":
      playerState.direction = "left";
      col = Math.ceil(playerState.x / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (
        surroundings.left ||
        (Tils[row][col - 1] === 7 && isBlockedByBomb())
      ) {
        if (playerState.y % TILE_SIZE > threshold) {
          playerState.y = Math.ceil(playerState.y / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE;
        }
        playerState.x -= playerState.speed * deltaTime;
      }
      moving = true;
      break;
    case "ArrowRight":
    case "d":
      playerState.direction = "right";
      col = Math.floor(playerState.x / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);

      if (
        surroundings.right ||
        (Tils[row][col + 1] === 7 && isBlockedByBomb())
      ) {
        if (playerState.y % TILE_SIZE > threshold) {
          playerState.y = Math.ceil(playerState.y / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE;
        }
        playerState.x += playerState.speed * deltaTime;
      }
      moving = true;
      break;
  }

  if (moving) {
    const currentTime = performance.now();
    playerState.row = Math.round(playerState.y / TILE_SIZE);
    playerState.col = Math.round(playerState.x / TILE_SIZE);
    if (currentTime - lastAnimationTime > frameInterval) {
      playerState.frame = (playerState.frame + 1) % 4;
      lastAnimationTime = currentTime;
    }
  } else {
    playerState.frame = 0;
  }
}

export function render() {
  player = document.getElementById("player");
  player.style.transform = `translate(${playerState.x}px, ${playerState.y}px)`;
  const row = spriteDirections[playerState.direction];
  player.style.backgroundPosition = `-${playerState.frame * TILE_SIZE}px -${
    row * TILE_SIZE
  }px`;
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
  if (event.key === " " && player.classList.length === 1 && lives > 0) {
    event.preventDefault();
    placeBomb();
  }
});
