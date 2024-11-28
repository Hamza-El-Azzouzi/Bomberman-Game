import { placeBomb } from "./bomb.js";
import * as utils from "../utils/collision.js"
import {Tils} from "../main.js"
const TILE_SIZE = 50
const player = document.getElementById('player');
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
    speed: 200,
    direction: 'down',
    frame: 0,
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
  const surroundings = utils.checkSurroundings(playerState, Tils, TILE_SIZE);

  let moving = false;

  switch (lastKey) {
    case 'ArrowUp':
    case 'w':
      playerState.direction = 'up';
      if (playerState.x %50 === 0 && surroundings.up) {
        playerState.y -= playerState.speed * deltaTime;
      }
      moving = true;
      break;
    case 'ArrowDown':
    case 's':
      playerState.direction = 'down';
      if (playerState.x %50 === 0 && surroundings.down) {
        playerState.y += playerState.speed * deltaTime;
      }
      moving = true;
      break;
    case 'ArrowLeft':
    case 'a':
      playerState.direction = 'left';
      if (playerState.y %50 === 0 && surroundings.left) {
        playerState.x -= playerState.speed * deltaTime;
      }
      moving = true;
      break;
    case 'ArrowRight':
    case 'd':
      playerState.direction = 'right';
      console.log(playerState.y,surroundings.right)
      if (playerState.y %50 === 0 && surroundings.right) {
        playerState.x += playerState.speed * deltaTime;
      }
      moving = true;
      break;
  }

  playerState.x = Math.max(TILE_SIZE, Math.min(mapBounds.width - TILE_SIZE, playerState.x));
  playerState.y = Math.max(TILE_SIZE, Math.min(mapBounds.height - TILE_SIZE, playerState.y));

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
    player.style.transform = `translate3d(${Math.round(playerState.x)}px, ${Math.round(playerState.y)}px, 0)`;

    const row = spriteDirections[playerState.direction];
    player.style.backgroundPosition = `-${playerState.frame * frameWidth}px -${row * frameHeight}px`;
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