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
  // console.log(row, col)
  if (!Array.isArray(tils) || tils.length === 0 || !Array.isArray(tils[0])) {
    throw new Error("Invalid tiles array");
  }

  return {
    up: row > 1 && (tils[row - 1][col] === 2 || tils[row - 1][col] === 4),
    down: row < tils.length - 1 && (tils[row + 1][col] === 2 || tils[row + 1][col] === 4),
    left: col > 1 && (tils[row][col - 1] === 2 || tils[row][col - 1] === 4),
    right: col < tils[0].length - 1 && (tils[row][col + 1] === 2 || tils[row][col + 1] === 4),
  };
}
export function checkSurroundingsBombsByEnemy(row, col, tils) {
  return {
    up: row > 1 && checkEnemy(col, row - 1, "up") && Tils[row - 1][col] != 1,
    down: row < tils.length - 1 && checkEnemy(col, row + 1, "down") && Tils[row + 1][col] != 1,
    left: col > 1 && checkEnemy(col - 1, row, "left") && Tils[row][col - 1] != 1,
    right: col < tils[0].length - 1 && checkEnemy(col + 1, row, "right") && Tils[row][col + 1] != 1,
  };
}

function checkEnemy(col, row, pos, debug = false) {
  const allEnemies = document.querySelectorAll(".enemy");

  if (debug) console.log(`------------------------start ${pos}-----------------------------`);
  const baseX = col * 50;
  const baseY = row * 50;
  const minX = baseX - 10;
  const maxX = baseX + 10;
  const minY = baseY - 10;
  const maxY = baseY + 10;

  for (const enemy of allEnemies) {
    const style = window.getComputedStyle(enemy);
    const transform = style.transform;

    if (debug) console.log(transform);

    if (transform && transform.includes("matrix")) {
      const match = transform.match(/matrix\((.+?)\)/);
      if (match) {
        const [a, b, c, d, tx, ty] = match[1].split(", ").map(parseFloat);

        if (debug) {
          console.log("Enemy Position (floored):", tx, ty);
          console.log("Expected Range (X):", minX, maxX, "Expected Range (Y):", minY, maxY);
        }
        if (tx >= minX && tx <= maxX && ty >= minY && ty <= maxY) {
          if (debug) console.log("Enemy detected within range!");
          return true;
        }
      }
    }
  }

  if (debug) console.log("-------------------------end---------------------------");

  return false;
}

export function checkSurroundingsByPlayer(row, col, tils) {
  // console.log(row > 1 && checkEnemy(col, row - 1, "up") && Tils[row - 1][col] != 1)
  return {
    up: row > 1 && checkEnemy(col, row - 1, "up") && Tils[row - 1][col] != 1,
    down: row < tils.length - 1 && checkEnemy(col, row + 1, "down") && Tils[row + 1][col] != 1,
    left: col > 1 && checkEnemy(col - 1, row, "left") && Tils[row][col - 1] != 1,
    right: col < tils[0].length - 1 &&checkEnemy(col + 1, row, "right") && Tils[row][col + 1] != 1,
  };
}

export function checkSurroundingsBombsByPlayer(row, col, tils) {
  return {
    up: row > 1 && checkPlayer(col, row - 1, "up") && Tils[row - 1][col] != 1,
    down: row < tils.length - 1 && checkPlayer(col, row + 1, "down") && Tils[row + 1][col] != 1,
    left: col > 1 && checkPlayer(col - 1, row, "left") && Tils[row][col - 1] != 1,
    right: col < tils[0].length - 1 && checkPlayer(col + 1, row, "right") && Tils[row][col + 1] != 1,
  };
}
function checkPlayer(col, row, pos, debug = false) {
  const palyer = document.querySelector(".player");
  // console.log(palyer)

  if (debug) console.log(`------------------------start ${pos}-----------------------------`);
  const baseX = col * 50;
  const baseY = row * 50;
  const minX = baseX - 45;
  const maxX = baseX + 45;
  const minY = baseY - 45;
  const maxY = baseY + 45;
  const style = window.getComputedStyle(palyer);
  const transform = style.transform;
  if (debug) console.log(transform);
  if (transform && transform.includes("matrix")) {
    const match = transform.match(/matrix\((.+?)\)/);
    if (match) {
      const [a, b, c, d, tx, ty] = match[1].split(", ").map(parseFloat);
      if (debug) {
        console.log("Player Position (floored):", tx, ty);
        console.log("Expected Range (X):", minX, maxX, "Expected Range (Y):", minY, maxY);
      }
      if ((tx >= minX && tx <= maxX && ty >= minY && ty <= maxY)) {
        if (debug) console.log("Player detected within range!");
        return true;
      }
    }
  }
  if (debug) console.log("-------------------------end---------------------------");

  return false;
}