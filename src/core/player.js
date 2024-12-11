import { Tils } from "../main.js";

import { placeBomb } from "./bomb.js";
import * as utils from "../utils/collision.js";
import { bombX, bombY } from "./bomb.js";
import { decreaseLives, increaseScore } from "../utils/hud.js";
function killPlayer(){
  const container = document.querySelector('.map');
  const player = document.querySelector(".player");

    player.remove()
    decreaseLives()
    const newPlayer = document.createElement('div');
    newPlayer.id = "player";
    newPlayer.className = "player";
    playerState.x = 50
    playerState.y = 50
    playerState.direction = "down"
    console.log(container)
    container.append(newPlayer)
    if (score > 0) {
      increaseScore(score - (Math.floor((score * 30) / 100)))
    }
}
const TILE_SIZE = 50;
let player;
export const spriteDirections = {
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

const activeKeys = [];
const frameInterval = 150;
let lastAnimationTime = 0;

export function update(deltaTime) {
  
  // console.log(container)
  player = document.getElementById("player");
  if (activeKeys.length === 0) {
    playerState.frame = 0;
    return;
  }

  const lastKey = activeKeys[activeKeys.length - 1];
  const threshold = 25;
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
      if (surroundings.up || (surroundings.up && isBlockedByBomb())) {
        if (playerState.x % TILE_SIZE > threshold) {
          playerState.x = Math.ceil(playerState.x / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE;
        }
        playerState.y -= Math.round(playerState.speed * deltaTime);
      }
      moving = true;
      break;
    case "ArrowDown":
    case "s":
      playerState.direction = "down";
      row = Math.floor(playerState.y / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.down || (surroundings.down && isBlockedByBomb())) {
        if (playerState.x % TILE_SIZE > threshold) {
          playerState.x = Math.ceil(playerState.x / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.x = Math.floor(playerState.x / TILE_SIZE) * TILE_SIZE;
        }
        playerState.y += Math.round(playerState.speed * deltaTime);
      }
      moving = true;
      break;
    case "ArrowLeft":
    case "a":
      playerState.direction = "left";
      col = Math.ceil(playerState.x / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.left || (surroundings.left && isBlockedByBomb())) {
        if (playerState.y % TILE_SIZE > threshold) {
          playerState.y = Math.ceil(playerState.y / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE;
        }
        playerState.x -= Math.round(playerState.speed * deltaTime);
      }
      moving = true;
      break;
    case "ArrowRight":
    case "d":
      playerState.direction = "right";
      col = Math.floor(playerState.x / TILE_SIZE);
      surroundings = utils.checkSurroundings(row, col, Tils);
      if (surroundings.right || (surroundings.right && isBlockedByBomb())) {
        if (playerState.y % TILE_SIZE > threshold) {
          playerState.y = Math.ceil(playerState.y / TILE_SIZE) * TILE_SIZE;
        } else {
          playerState.y = Math.floor(playerState.y / TILE_SIZE) * TILE_SIZE;
        }
        playerState.x += Math.round(playerState.speed * deltaTime);
      }
      moving = true;
      break;
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
  
  const surroundingPlayer = utils.checkSurroundingsByPlayer(Math.floor(playerState.y/50), Math.floor(playerState.x/50), Tils)
  console.log(surroundingPlayer)
  if (surroundingPlayer.up) {
    killPlayer()
  }else
  if (surroundingPlayer.down) {
    killPlayer()
  }
  if (surroundingPlayer.left) {
    killPlayer()
  }
  if (surroundingPlayer.right) {
    killPlayer()
  }
  player.style.transform = `translate3d(${Math.round(
    playerState.x
  )}px, ${Math.round(playerState.y)}px, 0)`;

  const row = spriteDirections[playerState.direction];
  player.style.backgroundPosition = `-${playerState.frame * TILE_SIZE}px -${row * TILE_SIZE
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
  if (event.key === " ") {
    event.preventDefault();
    placeBomb();
  }
});

