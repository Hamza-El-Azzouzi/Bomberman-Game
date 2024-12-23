import { Tils } from "../main.js";
import {
  checkSurroundingsBombs,
  checkSurroundingsBombsByEnemy,
  checkSurroundingsBombsByPlayer,
  checkSurroundingsPlayerByEnemy
} from "../utils/collision.js";
import { enemies } from "../constants/constants.js";
import { TILE_SIZE,playerState } from "../utils/check_resizing.js";
import { killPlayer } from "./player.js";
import { increaseScore, score } from "../utils/hud.js";

let activeBomb = null;
let container;
var rows = 13;
var cols = 15;
export let bombX = 0;
export let bombY = 0;
export function placeBomb() {
  container = document.querySelector(".map");
  if (activeBomb) return;

  bombX = Math.round(playerState.x / TILE_SIZE);
  bombY = Math.round(playerState.y / TILE_SIZE);

  const bomb = document.createElement("div");
  bomb.className = "bomb";
  bomb.style.width = TILE_SIZE + "px";
  bomb.style.height = TILE_SIZE + "px";
  bomb.style.transform = `translate(${bombX * TILE_SIZE}px, ${bombY * TILE_SIZE
    }px)`;
  container.insertBefore(bomb, container.firstChild);

  Tils[bombY][bombX] = 7;
  activeBomb = bomb;
  setTimeout(() => {
    bomb.remove();
    showExplosionEffect(bombX, bombY);
    activeBomb = null;
    Tils[bombY][bombX] = 0;
  }, 1500);
}
function getElementFromGrid(row, col) {
  let rows = document.querySelectorAll(".row")
  let decider = "lands";
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    throw new Error("Invalid row or column index");
  }
  if (rows[row].children[col].className === "rock") {
    if (Tils[row][col] === 4) {
      decider = "door";
      rows[row].children[col].setAttribute("y", row * TILE_SIZE);
      rows[row].children[col].setAttribute("x", col * TILE_SIZE);
    }
    Tils[row][col] = 0;
    rows[row].children[col].classList.remove("rock");
    increaseScore(100);
    rows[row].children[col].classList.add(decider);
  }
}
export function getElementByTranslate(row, col, element) {
  const allElement = document.querySelectorAll(element);
  for (const elem of allElement) {
    const style = window.getComputedStyle(elem);
    const transform = style.transform;
    if (transform && transform.includes("matrix")) {
      const match = transform.match(/matrix\((.+?)\)/);
      if (match) {
        const [a, b, c, d, tx, ty] = match[1]
          .split(", ")
          .map((v) => parseFloat(v));
        if (
          tx < (col + 2) * TILE_SIZE &&
          tx > (col - 2) * TILE_SIZE &&
          ty < (row + 2) * TILE_SIZE &&
          ty > (row - 2) * TILE_SIZE
        ) {
          if (element === ".enemy") {
            elem.remove();
            enemies.pop();
            increaseScore(500);
          } else {
            killPlayer();
            if (score > 0) {
              increaseScore(-Math.floor((score * 30) / 100));
            }
          }
        }
      }
    }
  }
}

function showExplosionEffect(bombX, bombY) {
  const explosion = document.createElement("div");
  const surroundingBombe = checkSurroundingsBombs(bombY, bombX, Tils);
  const surroundingEnemy = checkSurroundingsBombsByEnemy(bombY, bombX, Tils);
  const surroundingPlayer = checkSurroundingsBombsByPlayer(bombY, bombX, Tils);
 
  if (surroundingBombe.up) {
    getElementFromGrid(bombY - 1, bombX);
  }
  if (surroundingBombe.down) {
    getElementFromGrid(bombY + 1, bombX);
  }
  if (surroundingBombe.left) {
    getElementFromGrid(bombY, bombX - 1);
  }
  if (surroundingBombe.right) {
    getElementFromGrid(bombY, bombX + 1);
  }
  if (surroundingPlayer.up) {
    getElementByTranslate(bombY - 1, bombX, ".player");
  } else if (surroundingPlayer.down) {
    getElementByTranslate(bombY + 1, bombX, ".player");
  } else if (surroundingPlayer.left) {
    getElementByTranslate(bombY, bombX - 1, ".player");
  } else if (surroundingPlayer.right) {
    getElementByTranslate(bombY, bombX + 1, ".player");
  } else {
    if (
      Math.round(playerState.x / TILE_SIZE) === bombX &&
      Math.round(playerState.y / TILE_SIZE) === bombY
    ) {
      getElementByTranslate(bombY, bombX, ".player");
    }
  }

  if (surroundingEnemy.up) {
    getElementByTranslate(bombY - 1, bombX, ".enemy");
  }
  if (surroundingEnemy.down) {
    getElementByTranslate(bombY + 1, bombX, ".enemy");
  }
  if (surroundingEnemy.left) {
    getElementByTranslate(bombY, bombX - 1, ".enemy");
  }
  if (surroundingEnemy.right) {
    getElementByTranslate(bombY, bombX + 1, ".enemy");
  }

  if (Object.keys(surroundingEnemy).every((k) => !surroundingEnemy[k])) {
    enemies.forEach((enemy) => {
      if (
        Math.round(enemy.x / TILE_SIZE) === bombX &&
        Math.round(enemy.y / TILE_SIZE) === bombY
      ) {
        getElementByTranslate(bombY, bombX, ".enemy");
      }
    });
  }

  explosion.className = "explosion";
  explosion.style.width = TILE_SIZE+"px";
  explosion.style.height = TILE_SIZE+"px";
  explosion.style.backgroundSize = "" + TILE_SIZE * 4 + "px " + TILE_SIZE * 4 + "px";
  explosion.style.transform = `translate(${bombX * TILE_SIZE}px, ${bombY * TILE_SIZE
    }px)`;
    container.insertBefore(explosion, container.firstChild);

  let frame = 0;
  let row = 0;
  const totalFrames = 16;
  const frameInterval = 100;

  const interval = setInterval(() => {
    if (frame * row >= totalFrames) {
      clearInterval(interval);
      explosion.remove();
      return;
    }
    if (frame === 4) {
      row++;
      frame = 0;
    }
    explosion.style.backgroundPosition = `-${frame * TILE_SIZE}px -${row * TILE_SIZE
      }px`;
    frame++;
  }, frameInterval);
}
