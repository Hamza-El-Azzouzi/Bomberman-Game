import { placeBomb } from "./bomb.js";
import * as utils from "../utils/collision.js"
import {Tils} from "../main.js"
const TILE_SIZE = 48
const player = document.getElementById('player');
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
      if (surroundings.up) {
        playerState.y -= playerState.speed * deltaTime;
        playerState.direction = 'up';
        moving = true;
      }
      break;
    case 'ArrowDown':
    case 's':
      if (surroundings.down) {
        playerState.y += playerState.speed * deltaTime;
        playerState.direction = 'down';
        moving = true;
      }
      break;
    case 'ArrowLeft':
    case 'a':
      if (surroundings.left) {
        playerState.x -= playerState.speed * deltaTime;
        playerState.direction = 'left';
        moving = true;
      }
      break;
    case 'ArrowRight':
    case 'd':
      if (surroundings.right) {
        playerState.x += playerState.speed * deltaTime;
        playerState.direction = 'right';
        moving = true;
      }
      break;
  }

  playerState.x = Math.max(48, Math.min(mapBounds.width - 48, playerState.x));
  playerState.y = Math.max(48, Math.min(mapBounds.height - 48, playerState.y));

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