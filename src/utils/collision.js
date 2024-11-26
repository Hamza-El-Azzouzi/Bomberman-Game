
export function Collision(row, col, tils) {
  if (row < 0 || row >= tils.length || col < 0 || col >= tils[0].length) {
    return false;
  }
  return tils[row][col] === 0;
}
