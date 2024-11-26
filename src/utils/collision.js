export function getPlayerTilePosition(playerState, tileSize) {
  console.log("worked - getPlayerTilePosition");
  const row = Math.round(playerState.y / tileSize);
  const col = Math.round(playerState.x / tileSize);
  return { row, col };
}

export function checkSurroundings(playerState, tils, tileSize) {
  const { row, col } = getPlayerTilePosition(playerState, tileSize);

 console.log("row : "+row)
 console.log("col : " +col)


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
