import { Tils } from "../main.js";
import {
  checkSurroundingsBombs,
  checkSurroundingsBombsByEnemy,
} from "../utils/collision.js";
import { increaseScore } from "../utils/hud.js";
import { playerState } from "./player.js";
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
  bomb.style.transform = `translate3d(${bombX * frameWidth}px, ${
    bombY * frameWidth
  }px, 0)`;
  container.appendChild(bomb);

  Tils[bombY][bombX] = 7;
  activeBomb = bomb;
  setTimeout(() => {
    bomb.remove();
    showExplosionEffect(bombX, bombY);
    activeBomb = null;
    Tils[bombY][bombX] = 0;
  }, 1);
}
function getElementFromGrid(row, col) {
  let mapchlidern = container.children;
  const totalCells = rows * cols;

  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    throw new Error("Invalid row or column index");
  }
  const index = row * cols + col;
  if (index >= 0 && index < totalCells) {
    Tils[row][col] = 0;

    if (mapchlidern[index + 1].className === "rock")
      return mapchlidern[index + 1];
  }
  return null;
}
function getElementByTranslate3D(row, col) {
  const allEnemies = document.querySelectorAll(".enemy");
  for (const enemy of allEnemies) {
    const style = window.getComputedStyle(enemy);
    const transform = style.transform;
    if (transform && transform.includes("matrix")) {
      const match = transform.match(/matrix\((.+?)\)/);
      if (match) {
        const [a, b, c, d, tx, ty] = match[1]
          .split(", ")
          .map((v) => parseFloat(v));
        if (
          tx === col * 50 &&
          row > 1 &&
          ty <= row * 50 &&
          ty >= (row - 1) * 50
        ) {
          increaseScore(500);
          enemy.remove();
        }
        if (
          tx === col * 50 &&
          row < Tils.length - 1 &&
          ty >= row * 50 &&
          ty <= (row + 1) * 50
        ) {
          increaseScore(500);
          enemy.remove();
        }
        if (
          ty === row * 50 &&
          col > 1 &&
          tx <= col * 50 &&
          tx >= (col - 1) * 50
        ) {
          increaseScore(500);
          enemy.remove();
        }
        if (
          ty === row * 50 &&
          col < Tils[0].length - 1 &&
          tx >= col * 50 &&
          tx <= (col + 1) * 50
        ) {
          increaseScore(500);
          enemy.remove();
        }
      }
    }
  }
}

function showExplosionEffect(bombX, bombY) {
  const explosion = document.createElement("div");
  const surroundingBombe = checkSurroundingsBombs(bombY, bombX, Tils);
  const surroundingEnemy = checkSurroundingsBombsByEnemy(bombY, bombX, Tils);
  console.log(surroundingEnemy);
  if (surroundingEnemy.up || surroundingEnemy.down || surroundingEnemy.left || surroundingEnemy.right){
    getElementByTranslate3D(bombY, bombX);
  }
  if (surroundingBombe.up) {
    const element = getElementFromGrid(bombY - 1, bombX);
    if (element) {
      increaseScore(50);
      let decider = "lands";
      if (element.dataset.hiddenDoor === "true") decider = "door";
      element.classList.remove("rock");
      element.classList.add("rock-destroy");
      setTimeout(() => {
        element.classList.add(decider);
        element.classList.remove("rock-destroy");
      }, 900);
    }
  }
  if (surroundingBombe.down) {
    const element = getElementFromGrid(bombY + 1, bombX);
    if (element) {
      increaseScore(50);
      let decider = "lands";
      if (element.dataset.hiddenDoor === "true") decider = "door";
      element.classList.remove("rock");
      element.classList.add("rock-destroy");

      setTimeout(() => {
        element.classList.add(decider);
        element.classList.remove("rock-destroy");
      }, 900);
    }
  }
  if (surroundingBombe.left) {
    const element = getElementFromGrid(bombY, bombX - 1);
    if (element) {
      increaseScore(50);
      let decider = "lands";
      if (element.dataset.hiddenDoor === "true") decider = "door";
      element.classList.remove("rock");
      element.classList.add("rock-destroy");

      setTimeout(() => {
        element.classList.add(decider);
        element.classList.remove("rock-destroy");
      }, 900);
    }
  }
  if (surroundingBombe.right) {
    const element = getElementFromGrid(bombY, bombX + 1);

    if (element) {
      increaseScore(50);
      let decider = "lands";
      if (element.dataset.hiddenDoor === "true") decider = "door";
      element.classList.remove("rock");
      element.classList.add("rock-destroy");
      setTimeout(() => {
        element.classList.add(decider);
        element.classList.remove("rock-destroy");
      }, 900);
    }
  }

  explosion.className = "explosion";
  explosion.style.transform = `translate3d(${bombX * frameWidth}px, ${
    bombY * frameWidth
  }px, 0)`;
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
