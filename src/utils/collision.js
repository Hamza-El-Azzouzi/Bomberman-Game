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

export function checkSurroundingsBombs(row, col, tils){
  if (!Array.isArray(tils) || tils.length === 0 || !Array.isArray(tils[0])) {
    throw new Error("Invalid tiles array");
  }

  return {
    up: row > 1 && (tils[row - 1][col] === 2 || tils[row - 1][col] === 4 || tils[row - 1][col] === 3),
    down: row < tils.length - 1 && (tils[row + 1][col] === 2 || tils[row - 1][col] === 4 || tils[row - 1][col] === 3),
    left: col > 1 && (tils[row][col - 1] === 2 ||  tils[row][col - 1] === 4||  tils[row][col - 1] === 3),
    right: col < tils[0].length - 1 && (tils[row][col + 1] === 2 || tils[row][col + 1] === 4 || tils[row][col + 1] === 3),
  };
}