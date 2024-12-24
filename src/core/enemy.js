import { Tils } from "../main.js";
import { enemies } from "./bomb.js";
import { spriteDirections } from "../constants/constants.js";
import { TILE_SIZE, playerState } from "../utils/check_resizing.js";
import { checkSurroundings } from "../utils/collision.js";

const ENEMY_COUNT = 4;
const ANIMATION_INTERVAL = 150;

function getRandomValidPosition() {
  let row, col;

  let distance = 0;

  do {
    row = Math.floor(Math.random() * Tils.length);
    col = Math.floor(Math.random() * Tils[0].length);

    const playerRow = Math.floor(playerState.y / TILE_SIZE);
    const playerCol = Math.floor(playerState.x / TILE_SIZE);

    distance = Math.abs(row - playerRow) + Math.abs(col - playerCol);
  } while (Tils[row][col] !== 0 || distance < 5);

  return { row, col };
}

export function placeEnemies() {
  const map = document.querySelector(".map");

  for (let i = 0; i < ENEMY_COUNT; i++) {
    const { row, col } = getRandomValidPosition();

    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.classList.add(`id-${i}`);
    enemy.style.width = TILE_SIZE + "px";
    enemy.style.height = TILE_SIZE + "px";
    enemy.style.transform = `translate(${col * TILE_SIZE}px, ${row * TILE_SIZE
      }px)`;
    map.insertBefore(enemy, map.firstChild);

    enemies.push({
      element: enemy,
      x: col * TILE_SIZE,
      y: row * TILE_SIZE,
      row: row,
      col: col,
      speed: TILE_SIZE,
      direction: "down",
      frame: 0,
      lastUpdateTime: performance.now(),
    });
  }
}

function animateEnemy(enemy) {
  const currentTime = performance.now();

  if (currentTime - enemy.lastUpdateTime > ANIMATION_INTERVAL) {
    enemy.frame = (enemy.frame + 1) % 4;
    enemy.lastUpdateTime = currentTime;
  }

  const directionRow = spriteDirections[enemy.direction];
  const frameX = enemy.frame * TILE_SIZE;
  const frameY = directionRow * TILE_SIZE;

  enemy.element.style.backgroundPosition = `-${frameX}px -${frameY}px`;
}

function moveEnemy(enemy,frequence) {
  // const frequence = 0.0166;
  let currentRow = Math.round(enemy.y / TILE_SIZE);
  let currentCol = Math.round(enemy.x / TILE_SIZE);
  switch (enemy.direction) {
    case "up":
      currentRow = Math.ceil(enemy.y / TILE_SIZE);
      break;
    case "down":
      currentRow = Math.floor(enemy.y / TILE_SIZE);
      break;
    case "left":
      currentCol = Math.ceil(enemy.x / TILE_SIZE);
      break;
    case "right":
      currentCol = Math.floor(enemy.x / TILE_SIZE);
      break;
  }
  const surroundings = checkSurroundings(currentRow, currentCol, Tils);
  const possibleMoves = [];
  for (const move in surroundings) {
    if (surroundings[move]) possibleMoves.push(move);
  }
  if (possibleMoves.includes(enemy.direction)) {
    switch (enemy.direction) {
      case "up":
        enemy.y -= enemy.speed * frequence;
        break;
      case "down":
        enemy.y += enemy.speed * frequence;
        break;
      case "left":
        enemy.x -= enemy.speed * frequence;
        break;
      case "right":
        enemy.x += enemy.speed * frequence;
        break;
    }
  } else {
    if (possibleMoves.length > 2) {
      if (!surroundings[enemy.direction]) {
        enemy.direction =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      } else {
        enemy.direction =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      }
    } else {
      if (!surroundings[enemy.direction]) {
        enemy.direction =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      }
    }
  }
  enemy.row = Math.round(enemy.y/ TILE_SIZE)
  enemy.col = Math.round(enemy.x/ TILE_SIZE)
  animateEnemy(enemy);
  enemy.element.style.transform = `translate(${Math.round(
    enemy.x
  )}px, ${Math.round(enemy.y)}px)`;
}

export function updateEnemies(frequence) {
  enemies.forEach((enemy) => {
    moveEnemy(enemy,frequence);
  });
}
