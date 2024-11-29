export function checkSurroundings(row, col, tils) {
  if (!Array.isArray(tils) || tils.length === 0 || !Array.isArray(tils[0])) {
    throw new Error("Invalid tiles array");
  }
  // console.log(`palyer have those index row {${row}} col {${col}}`)
  // console.log( `can move up - ${tils[row - 1][col]}`)
  // console.log( `can move down - ${tils[row +1][col]}`)
  // console.log(`can move left - ${tils[row][col - 1]}`)
  // console.log( `can move right - ${tils[row][col+1]}`)

  return {
    up: row > 0 && tils[row - 1][col] === 0,
    down: row < tils.length - 1 && tils[row + 1][col] === 0,
    left: col > 0 && tils[row][col - 1] === 0,
    right: col < tils[0].length - 1 && tils[row][col + 1] === 0,
  };
}