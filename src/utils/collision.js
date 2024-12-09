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
  const allEnemies = document.querySelectorAll(".enemy");
  let sur = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  for (const enemy of allEnemies) {
    const style = window.getComputedStyle(enemy);
    const transform = style.transform;
    if (transform && transform.includes("matrix")) {
      const match = transform.match(/matrix\((.+?)\)/);
      if (match) {
        var [a, b, c, d, tx, ty] = match[1]
          .split(", ")
          .map((v) => parseFloat(v));
        if (
          tx === col * 50 &&
          row > 1 &&
          ty <= row * 50 &&
          ty >= (row - 1) * 50
        ) {
          sur["up"] = true;
        }
        if (
          tx === col * 50 &&
          row < tils.length - 1 &&
          ty >= row * 50 &&
          ty <= (row + 1) * 50
        ) {
          sur["down"] = true;
        }
        if (
          ty === row * 50 &&
          col > 1 &&
          tx <= col * 50 &&
          tx >= (col - 1) * 50
        ) {
          sur["left"]=true
        }
        if (
          ty === row * 50 &&
          col < tils[0].length - 1 &&
          tx >= col * 50 &&
          tx <= (col + 1) * 50
        ) {
          sur["right"]=true
        }
      }
    }
  }
  return sur;
}
