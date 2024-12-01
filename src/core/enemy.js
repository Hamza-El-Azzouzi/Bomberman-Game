import { Tils } from "../main.js";
import { playerState, spriteDirections } from "./player.js";
import { checkSurroundings } from "../utils/collision.js";

const TILE_SIZE = 50;
const ENEMY_COUNT = 4;
const enemies = [];
const frameInterval = 100;
let lastAnimationTime = 0;

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
    enemy.style.transform = `translate3d(${col * TILE_SIZE}px, ${
      row * TILE_SIZE
    }px, 0)`;
    map.appendChild(enemy);

    enemies.push({ element: enemy, row, col });
  }
}

function updateEnemyPositions(deltaTime) {
  enemies.forEach((enemy) => {
    const { row, col } = enemy;
    const surroundings = checkSurroundings(row, col, Tils);

    const possibleMoves = [];
    if (surroundings.up) possibleMoves.push({ row: row - 1, col });
    if (surroundings.down) possibleMoves.push({ row: row + 1, col });
    if (surroundings.left) possibleMoves.push({ row, col: col - 1 });
    if (surroundings.right) possibleMoves.push({ row, col: col + 1 });

    if (possibleMoves.length > 0) {
      const nextMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      Tils[enemy.row][enemy.col] = 0;
      Tils[nextMove.row][nextMove.col] = 3;
      enemy.row = nextMove.row;
      enemy.col = nextMove.col;
      enemy.element.style.transform = `translate3d(${
        nextMove.col * TILE_SIZE
      }px, ${nextMove.row * TILE_SIZE}px, 0)`;
      const currentTime = performance.now();
      if (currentTime - lastAnimationTime > frameInterval) {
        playerState.frame = (playerState.frame + 1) % 4;
        lastAnimationTime = currentTime;
      }
      const row = spriteDirections[playerState.direction];
      player.style.backgroundPosition = `-${playerState.frame * TILE_SIZE}px -${
        row * TILE_SIZE
      }px`;
    }
  });
}

export function updateEnemies(deltaTime) {
  updateEnemyPositions(deltaTime);
}
