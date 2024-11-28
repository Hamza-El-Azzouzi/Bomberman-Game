export function getPlayerTilePosition(playerState, tileSize) {
  console.log("worked - getPlayerTilePosition");
  let row,col = 0
  if (playerState.direction === "up" || playerState.direction === "left"){
    row = Math.ceil(playerState.y / tileSize);
    col = Math.ceil(playerState.x / tileSize);
  }else{
    row = Math.floor(playerState.y / tileSize);
    col = Math.floor(playerState.x / tileSize);
  }
  console.log(`Player is at row: ${row}, col: ${col}`);
  return { row, col };
}

export function checkSurroundings(playerState, tils, tileSize) {
  if (!Array.isArray(tils) || tils.length === 0 || !Array.isArray(tils[0])) {
    throw new Error("Invalid tiles array");
  }
  console.log(`palyer have those index row {${playerState.y / tileSize}} col {${playerState.x / tileSize}}`)
  const { row, col } = getPlayerTilePosition(playerState, tileSize);
  console.log( `can move up - ${tils[row - 1][col]}`)
  console.log( `can move down - ${tils[row +1][col]}`)
  console.log( `can move left - ${tils[row][col-1]}`)
  console.log( `can move right - ${tils[row][col+1]}`)

  return {
    up: row > 0 && tils[row - 1][col] === 0,
    down: row < tils.length - 1 && tils[row + 1][col] === 0,
    left: col > 0 && tils[row][col - 1] === 0,
    right: col < tils[0].length - 1 && tils[row][col + 1] === 0,
  };
}

export function processSurroundings(surroundings) {
  console.log("worked - ProcessSurroundings");
  for (const [direction, value] of Object.entries(surroundings)) {
    console.log(`Direction: ${direction}, Value: ${value}`);
  }
}

// Example: Break tile logic (destructible tiles)
export function breakTile(row, col, tils) {
  for (const [direction, value] of Object.entries(surroundings)) {
    console.log(`Direction: ${direction}, Value: ${value}`);
  }
}
