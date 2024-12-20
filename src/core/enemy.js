import { Tils } from "../main.js";
import { spriteDirections, enemies } from "../constants/constants.js";
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
    enemy.className = "enemy";
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
      direction: "down",
      frame: 0,
      lastUpdateTime: performance.now(),
    });
  }
}

function smoothMoveEnemy(enemy, direction, steps, stepSize, onComplete) {
  let stepCount = 0;

  function moveStep() {
    if (stepCount >= steps) {
      if (onComplete) onComplete();
      return;
    }

    switch (direction) {
      case "up":
        enemy.y -= stepSize;
        break;
      case "down":
        enemy.y += stepSize;
        break;
      case "left":
        enemy.x -= stepSize;
        break;
      case "right":
        enemy.x += stepSize;
        break;
    }
    animateEnemy(enemy);
    enemy.element.style.transform = `translate(${Math.round(
      enemy.x
    )}px, ${Math.round(enemy.y)}px)`;

    stepCount++;
    setTimeout(moveStep, 60);
  }

  moveStep();
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

function moveEnemy(enemy) {
  const TILE_STEP_COUNT = 20;
  const STEP_SIZE = TILE_SIZE / TILE_STEP_COUNT;

  if (enemy.isMoving) return;

  const currentRow = Math.floor(enemy.y / TILE_SIZE);
  const currentCol = Math.floor(enemy.x / TILE_SIZE);
  const surroundings = checkSurroundings(currentRow, currentCol, Tils);

  const possibleMoves = [];
  for (const move in surroundings) {
    if (surroundings[move]) possibleMoves.push(move);
  }

  if (possibleMoves.length > 2) {
    if (!surroundings[enemy.direction]) {
      enemy.direction =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else if (Math.random() < 0.2) {
      enemy.direction =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  } else {
    if (!surroundings[enemy.direction]) {
      enemy.direction =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }

  enemy.row = currentRow;
  enemy.col = currentCol;

  switch (enemy.direction) {
    case "up":
      enemy.row -= 1;
      break;
    case "down":
      enemy.row += 1;
      break;
    case "left":
      enemy.col -= 1;
      break;
    case "right":
      enemy.col += 1;
      break;
  }

  if (
    enemy.row >= 0 &&
    enemy.row < Tils.length &&
    enemy.col >= 0 &&
    enemy.col < Tils[0].length &&
    Tils[enemy.row][enemy.col] === 0
  ) {
    enemy.isMoving = true;
    smoothMoveEnemy(enemy, enemy.direction, TILE_STEP_COUNT, STEP_SIZE, () => {
      enemy.isMoving = false;
      enemy.x = enemy.col * TILE_SIZE;
      enemy.y = enemy.row * TILE_SIZE;
    });
  }
}

export function updateEnemies(deltaTime) {
  enemies.forEach((enemy) => {
    moveEnemy(enemy, deltaTime);
  });
}
