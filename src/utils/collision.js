import { TILE_SIZE } from "./check_resizing.js";
import { Tils } from "../main.js";

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
    up: row > 1 && checkEnemy(col, row - 1, "up") && Tils[row - 1][col] != 1,
    down:
      row < tils.length - 1 &&
      checkEnemy(col, row + 1, "down") &&
      Tils[row + 1][col] != 1,
    left:
      col > 1 && checkEnemy(col - 1, row, "left") && Tils[row][col - 1] != 1,
    right:
      col < tils[0].length - 1 &&
      checkEnemy(col + 1, row, "right") &&
      Tils[row][col + 1] != 1,
  };
}

function checkEnemy(col, row) {
  const allEnemies = document.querySelectorAll(".enemy");

  const baseX = col * TILE_SIZE;
  const baseY = row * TILE_SIZE;
  const minX = baseX - 10;
  const maxX = baseX + 10;
  const minY = baseY - 10;
  const maxY = baseY + 10;

  for (const enemy of allEnemies) {
    const style = window.getComputedStyle(enemy);
    const transform = style.transform;

    if (transform && transform.includes("matrix")) {
      const match = transform.match(/matrix\((.+?)\)/);
      if (match) {
        const [a, b, c, d, tx, ty] = match[1].split(", ").map(parseFloat);
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
    up: row > 1 && checkEnemy(col, row - 1, "up") && Tils[row - 1][col] != 1,
    down:
      row < tils.length - 1 &&
      checkEnemy(col, row + 1, "down") &&
      Tils[row + 1][col] != 1,
    left:
      col > 1 && checkEnemy(col - 1, row, "left") && Tils[row][col - 1] != 1,
    right:
      col < tils[0].length - 1 &&
      checkEnemy(col + 1, row, "right") &&
      Tils[row][col + 1] != 1,
  };
}

export function checkSurroundingsBombsByPlayer(row, col, tils) {
  return {
    up: row > 1 && checkPlayer(col, row - 1, "up") && Tils[row - 1][col] != 1,
    down:
      row < tils.length - 1 &&
      checkPlayer(col, row + 1, "down") &&
      Tils[row + 1][col] != 1,
    left:
      col > 1 && checkPlayer(col - 1, row, "left") && Tils[row][col - 1] != 1,
    right:
      col < tils[0].length - 1 &&
      checkPlayer(col + 1, row, "right") &&
      Tils[row][col + 1] != 1,
  };
}
function checkPlayer(col, row) {
  const palyer = document.querySelector(".player");
  const baseX = col * TILE_SIZE;
  const baseY = row * TILE_SIZE;
  const minX = baseX - 45;
  const maxX = baseX + 45;
  const minY = baseY - 45;
  const maxY = baseY + 45;
  const style = window.getComputedStyle(palyer);
  const transform = style.transform;
  if (transform && transform.includes("matrix")) {
    const match = transform.match(/matrix\((.+?)\)/);
    if (match) {
      const [a, b, c, d, tx, ty] = match[1].split(", ").map(parseFloat);
      if (tx >= minX && tx <= maxX && ty >= minY && ty <= maxY) {
        return true;
      }
    }
  }
  return false;
}
