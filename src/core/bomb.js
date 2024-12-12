import { Tils } from "../main.js";
import {
  checkSurroundingsBombs,
  checkSurroundingsBombsByEnemy,
  checkSurroundingsBombsByPlayer,
} from "../utils/collision.js";
import { playerState } from "./player.js";
import { increaseScore, decreaseLives, score, lives } from "../utils/hud.js";
import { enemies } from "./enemy.js";

let activeBomb = null;
const frameWidth = 50;
let container;
var rows = 13;
var cols = 15;
export let bombX = 0;
export let bombY = 0;
export function placeBomb() {
  container = document.querySelector(".map");
  if (activeBomb) return;

  bombX = Math.round(playerState.x / frameWidth);
  bombY = Math.round(playerState.y / frameWidth);

  const bomb = document.createElement("div");
  bomb.className = "bomb";
  bomb.style.transform = `translate(${bombX * frameWidth}px, ${
    bombY * frameWidth
  }px)`;
  container.appendChild(bomb);

  Tils[bombY][bombX] = 7;
  activeBomb = bomb;
  setTimeout(() => {
    bomb.remove();
    showExplosionEffect(bombX, bombY);
    activeBomb = null;
    Tils[bombY][bombX] = 0;
  }, 800);
}
function getElementFromGrid(row, col) {
  console.log(Tils);
  console.log("got entred to found the grid");
  let mapchlidern = container.children;
  let decider = "lands";
  console.log(mapchlidern);
  const totalCells = rows * cols;

  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    throw new Error("Invalid row or column index");
  }
  const index = row * cols + col;
  let position = 1;
  if (index >= 0 && index < totalCells) {
    if (lives != 5) position = 0;
    if (mapchlidern[index + position].className === "rock") {
      if (Tils[row][col] === 4) {
        decider = "door";
      }
      Tils[row][col] = 0;
      mapchlidern[index + position].classList.remove("rock");
      mapchlidern[index + position].classList.add("rock-destroy");
      increaseScore(100);
      mapchlidern[index + position].classList.add(decider);
      mapchlidern[index + position].classList.remove("rock-destroy");
    }
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
          tx < (col + 2) * 50 &&
          tx > (col - 2) * 50 &&
          ty < (row + 2) * 50 &&
          ty > (row - 2) * 50
        ) {
          console.info("good condition worked!");
          elem.remove();
          if (element === ".enemy") {
            enemies.pop();
            increaseScore(500);
          } else {
            decreaseLives();
            const player = document.createElement("div");
            player.id = "player";
            player.className = "player";
            playerState.x = 50;
            playerState.y = 50;
            playerState.direction = "down";
            container.append(player);
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
  }
  if (surroundingPlayer.down) {
    getElementByTranslate(bombY + 1, bombX, ".player");
  }
  if (surroundingPlayer.left) {
    getElementByTranslate(bombY, bombX - 1, ".player");
  }
  if (surroundingPlayer.right) {
    getElementByTranslate(bombY, bombX + 1, ".player");
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

  if (
    Math.round(playerState.x / frameWidth) === bombX &&
    Math.round(playerState.y / frameWidth) === bombY
  ) {
    getElementByTranslate(bombY, bombX, ".player");
  }

  enemies.forEach((enemy) => {
    if (
        Math.round(enemy.x / frameWidth) === bombX &&
        Math.round(enemy.y / frameWidth) === bombY
      ) {
        getElementByTranslate(bombY, bombX, ".enemy");
      }
  });
  explosion.className = "explosion";
  explosion.style.transform = `translate(${bombX * frameWidth}px, ${
    bombY * frameWidth
  }px)`;
  container.appendChild(explosion);

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
    explosion.style.backgroundPosition = `-${frame * frameWidth}px -${
      row * frameWidth
    }px`;
    frame++;
  }, frameInterval);
}
