import { Tils } from "../main.js";
import {
  checkSurroundings,
  checkSurroundingsBombs,
  checkSurroundingsBombsByEnemy,
  checkSurroundingsBombsByPlayer,
} from "../utils/collision.js";
import { TILE_SIZE, playerState } from "../utils/check_resizing.js";
import { killPlayer } from "./player.js";
import { increaseScore, score } from "../utils/hud.js";

export var enemies = [];
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
  bomb.style.transform = `translate(${bombX * TILE_SIZE}px, ${
    bombY * TILE_SIZE
  }px)`;
  container.insertBefore(bomb, container.firstChild);

  Tils[bombY][bombX] = 7;
  activeBomb = bomb;
  setTimeout(() => {
    bomb.remove();
    const surroundings = checkSurroundings(bombY, bombX, Tils);
    const surroundingEnemy = checkSurroundingsBombsByEnemy(bombY, bombX, Tils);
    if (surroundings.up || surroundingEnemy.up) {
      explode(bombX, bombY - 1);
    }
    if (surroundings.down || surroundingEnemy.down) {
      explode(bombX, bombY + 1);
    }
    if (surroundings.left || surroundingEnemy.left) {
      explode(bombX - 1, bombY);
    }
    if (surroundings.right || surroundingEnemy.right) {
      explode(bombX + 1, bombY);
    }
    showExplosionEffect(bombX, bombY);
    activeBomb = null;
    Tils[bombY][bombX] = 0;
  }, 1500);
}
function getElementFromGrid(row, col) {
  let rowElements = document.querySelectorAll(".row");
  let decider = "lands";
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    throw new Error("Invalid row or column index");
  }
  if (rowElements[row].children[col].className === "rock") {
    if (Tils[row][col] === 4) {
      decider = "door";
      rowElements[row].children[col].setAttribute("y", row * TILE_SIZE);
      rowElements[row].children[col].setAttribute("x", col * TILE_SIZE);
    }
    Tils[row][col] = 0;
    rowElements[row].children[col].classList.remove("rock");
    increaseScore(100);
    rowElements[row].children[col].classList.add(decider);
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
        const coords = match[1].split(", ").map(parseFloat);
        const tx = coords[4];
        const ty = coords[5];
        if (
          tx < (col + 2) * TILE_SIZE &&
          tx > (col - 2) * TILE_SIZE &&
          ty < (row + 2) * TILE_SIZE &&
          ty > (row - 2) * TILE_SIZE
        ) {
          if (element === ".enemy") {
            elem.remove();
            enemies = enemies.filter((enemy) => {
              return enemy.element.classList[1] !== elem.classList[1];
            });
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
  explode(bombX, bombY);
}

function explode(bombX, bombY) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.width = TILE_SIZE + "px";
  explosion.style.height = TILE_SIZE + "px";
  explosion.style.backgroundSize =
    "" + TILE_SIZE * 4 + "px " + TILE_SIZE * 4 + "px";
  explosion.style.transform = `translate(${bombX * TILE_SIZE}px, ${
    bombY * TILE_SIZE
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
    explosion.style.backgroundPosition = `-${frame * TILE_SIZE}px -${
      row * TILE_SIZE
    }px`;
    frame++;
  }, frameInterval);
}
