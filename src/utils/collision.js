import { playerState, TILE_SIZE } from "./check_resizing.js";
import { Tils } from "../main.js";
import { enemies } from "../constants/constants.js";

export function checkSurroundings(row, col, tils) {
  if (!Array.isArray(tils) || tils.length === 0 || !Array.isArray(tils[0])) {
    throw new Error("Invalid tiles array");
  }

  return {
    up: row > 0 && tils[row - 1][col] === 0,
    down: row < tils.length - 1 && tils[row + 1][col] === 0,
    left: col > 0 && tils[row][col - 1] === 0,
    right: col < tils[0].length - 1 && tils[row][col + 1] === 0,
  };
}

export function checkSurroundingsBombs(row, col, tils) {
  if (!Array.isArray(tils) || tils.length === 0 || !Array.isArray(tils[0])) {
    throw new Error("Invalid tiles array");
  }

  return {
    up: row > 1 && (tils[row - 1][col] === 2 || tils[row - 1][col] === 4),
    down:
      row < tils.length - 1 &&
      (tils[row + 1][col] === 2 || tils[row + 1][col] === 4),
    left: col > 1 && (tils[row][col - 1] === 2 || tils[row][col - 1] === 4),
    right:
      col < tils[0].length - 1 &&
      (tils[row][col + 1] === 2 || tils[row][col + 1] === 4),
  };
}
export function checkSurroundingsBombsByEnemy(row, col, tils) {
  return {
    up: row > 1 && checkEnemy(col, row - 1) && Tils[row - 1][col] != 1,
    down:
      row < tils.length - 1 &&
      checkEnemy(col, row + 1) &&
      Tils[row + 1][col] != 1,
    left: col > 1 && checkEnemy(col - 1, row) && Tils[row][col - 1] != 1,
    right:
      col < tils[0].length - 1 &&
      checkEnemy(col + 1, row) &&
      Tils[row][col + 1] != 1,
  };
}

function checkEnemy(col, row) {
  const allEnemies = document.querySelectorAll(".enemy");

  const baseX = col * TILE_SIZE;
  const baseY = row * TILE_SIZE;
  const minX = baseX - TILE_SIZE / 5;
  const maxX = baseX + TILE_SIZE / 5;
  const minY = baseY - TILE_SIZE / 5;
  const maxY = baseY + TILE_SIZE / 5;

  for (const enemy of allEnemies) {
    const style = window.getComputedStyle(enemy);
    const transform = style.transform;

    if (transform && transform.includes("matrix")) {
      const match = transform.match(/matrix\((.+?)\)/);
      if (match) {
        const coords = match[1].split(", ").map(parseFloat);
        const tx = coords[4];
        const ty = coords[5];
        if (tx >= minX && tx <= maxX && ty >= minY && ty <= maxY) {
          return true;
        }
      }
    }
  }

  return false;
}

export function checkSurroundingsByPlayer(row, col, tils) {
  return {
    up: row > 1 && checkEnemy(col, row - 1) && Tils[row - 1][col] != 1,
    down:
      row < tils.length - 1 &&
      checkEnemy(col, row + 1) &&
      Tils[row + 1][col] != 1,
    left:
      col > 1 && checkEnemy(col - 1, row) && Tils[row][col - 1] != 1,
    right:
      col < tils[0].length - 1 &&
      checkEnemy(col + 1, row) &&
      Tils[row][col + 1] != 1,
  };
}

export function checkSurroundingsBombsByPlayer(row, col, tils) {
  return {
    up: row > 1 && checkPlayer(col, row - 1) && Tils[row - 1][col] != 1,
    down:
      row < tils.length - 1 &&
      checkPlayer(col, row + 1) &&
      Tils[row + 1][col] != 1,
    left: col > 1 && checkPlayer(col - 1, row) && Tils[row][col - 1] != 1,
    right:
      col < tils[0].length - 1 &&
      checkPlayer(col + 1, row) &&
      Tils[row][col + 1] != 1,
  };
}
function checkPlayer(col, row) {
  const palyer = document.querySelector(".player");
  const baseX = col * TILE_SIZE;
  const baseY = row * TILE_SIZE;
  const num = Math.floor((90 / 100) * TILE_SIZE);
  const minX = baseX - num;
  const maxX = baseX + num;
  const minY = baseY - num;
  const maxY = baseY + num;
  const style = window.getComputedStyle(palyer);
  const transform = style.transform;
  if (transform && transform.includes("matrix")) {
    const match = transform.match(/matrix\((.+?)\)/);
    if (match) {
      const coords = match[1].split(", ").map(parseFloat);
      const tx = coords[4];
      const ty = coords[5];
      if (tx >= minX && tx <= maxX && ty >= minY && ty <= maxY) {
        return true;
      }
    }
  }
  return false;
}

export function checkSurroundingsPlayerByEnemy() {
  return {
    up: collisionPlayerWithEnemy("up"),
    down: collisionPlayerWithEnemy("down"),
    left: collisionPlayerWithEnemy("left"),
    right: collisionPlayerWithEnemy("right"),
  };
}

function collisionPlayerWithEnemy(direction) {
  for (const enemy of enemies){
    if (direction === "up" && playerState.x === enemy.x && playerState.y > enemy.y && playerState.y - (TILE_SIZE / 1.3) < enemy.y) {
      return true;
    }
    if (direction === "down" && playerState.x === enemy.x && playerState.y < enemy.y && playerState.y + (TILE_SIZE / 1.3) > enemy.y) {
      return true;
    }
    if (direction === "left" && playerState.y === enemy.y && playerState.x > enemy.x && playerState.x - (TILE_SIZE / 1.9) < enemy.x) {
      return true;
    }
    if (direction === "right" && playerState.y === enemy.y && playerState.x < enemy.x && playerState.x + (TILE_SIZE / 1.9) > enemy.x) {
      return true;
    }
  }
  return false;
}