import { Tils } from "../main.js";
import { playerState, spriteDirections } from "./player.js";
import { checkSurroundings } from "../utils/collision.js";

const TILE_SIZE = 50;
const ENEMY_COUNT = 4;
const ANIMATION_INTERVAL = 150;

export const enemies = [];

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
    enemy.style.transform = `translate(${col * TILE_SIZE}px, ${
      row * TILE_SIZE
    }px)`;
    map.appendChild(enemy);

    enemies.push({
      element: enemy,
      x: col * TILE_SIZE,
      y: row * TILE_SIZE,
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
    setTimeout(moveStep, 30);
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

  let newRow = currentRow;
  let newCol = currentCol;

  switch (enemy.direction) {
    case "up":
      newRow -= 1;
      break;
    case "down":
      newRow += 1;
      break;
    case "left":
      newCol -= 1;
      break;
    case "right":
      newCol += 1;
      break;
  }

  if (
    newRow >= 0 &&
    newRow < Tils.length &&
    newCol >= 0 &&
    newCol < Tils[0].length &&
    Tils[newRow][newCol] === 0
  ) {
    enemy.isMoving = true;
    smoothMoveEnemy(enemy, enemy.direction, TILE_STEP_COUNT, STEP_SIZE, () => {
      enemy.isMoving = false;
      enemy.x = newCol * TILE_SIZE;
      enemy.y = newRow * TILE_SIZE;
    });
  }
}

export function updateEnemies(deltaTime) {
  enemies.forEach((enemy) => {
    moveEnemy(enemy, deltaTime);
  });
}
