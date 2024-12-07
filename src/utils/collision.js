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
    down: row < tils.length - 1 && (tils[row + 1][col] === 2 || tils[row + 1][col] === 4),
    left: col > 1 && (tils[row][col - 1] === 2 || tils[row][col - 1] === 4),
    right: col < tils[0].length - 1 && (tils[row][col + 1] === 2 || tils[row][col + 1] === 4),
  };
}
export function checkSurroundingsBombsByEnemy(row, col, tils) {
  return {
    up: row > 1 && checkEnemy(col, row - 1),
    down: row < tils.length - 1 && checkEnemy(col, row + 1),
    left: col > 1 && checkEnemy(col - 1, row),
    right: col < tils[0].length - 1 && checkEnemy(col + 1, row),
  };
}

function checkEnemy(col, row) {
  const allEnemies = document.querySelectorAll(".enemy");
  for (const enemy of allEnemies) {
    const style = window.getComputedStyle(enemy);
    const transform = style.transform
    if (transform && transform.includes("matrix")) {
      const match = transform.match(/matrix\((.+?)\)/);
      if (match) {
        var [a, b, c, d, tx, ty] = match[1].split(", ").map((v) => parseFloat(v));
        if (tx === col * 50 && ty === row * 50) {
          return true
        }
      }
    }
  }
}