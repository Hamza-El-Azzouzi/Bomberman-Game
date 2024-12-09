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
  console.log(row, col)
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
    up: row > 1 && checkEnemy(col, row - 1 , "up") && Tils[row-1][col] != 1,
    down: row < tils.length - 1 && checkEnemy(col, row + 1, "down") && Tils[row+1][col] != 1,
    left: col > 1 && checkEnemy(col - 1, row, "left")&& Tils[row][col-1] != 1,
    right: col < tils[0].length - 1 && checkEnemy(col + 1, row, "right")&& Tils[row][col+1] != 1,
  };
}

function checkEnemy(col, row, pos, debug = true) {
  const allEnemies = document.querySelectorAll(".enemy");

  if (debug) console.log(`------------------------start ${pos}-----------------------------`);

  // Precompute grid boundaries
  const baseX = col * 50;
  const baseY = row * 50;
  const minX = baseX - 10 ; 
  const maxX = baseX + 10 ;
  const minY = baseY - 10 ;
  const maxY = baseY + 10 ; 

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

        // Check if the enemy's position falls within the calculated range
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


// function checkEnemy(col, row, pos) {
//   const allEnemies = document.querySelectorAll(".enemy");
//   console.log(`------------------------start ${pos}-----------------------------`)
//   for (const enemy of allEnemies) {
//     const style = window.getComputedStyle(enemy);
//     const transform = style.transform
//     console.log(transform)
//     if (transform && transform.includes("matrix")) {
//       const match = transform.match(/matrix\((.+?)\)/);
//       if (match) {

//         var [a, b, c, d, tx, ty] = match[1].split(", ").map((v) => parseFloat(v));
//         console.log(" flored before condition x,y", tx, ty)
//         console.log("col, row", col * 50, row * 50)
//         console.log(tx <= (col + 1) * 50 && tx >= (col - 1) * 50)
//         console.log(ty <= (row + 1) * 50 && ty >= (row - 1) * 50)
//         return ((tx < (col + 2) * 50 && tx > (col - 2) * 50) && (ty < (row + 2) * 50 && ty > (row - 2) * 50))
//         // if (tx <= col * 50 && tx > col) {
//         //   console.log("col, row", col, row)
//         //   console.log("condition true x,y", tx, ty)
//         //   return true
//         // }
//       }
//     }
//   }
//   console.log("-------------------------end---------------------------")
// }