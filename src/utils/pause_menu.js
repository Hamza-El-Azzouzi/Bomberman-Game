import { init } from "../main.js";
import { playerState } from "../core/player.js"
import { gameLoop } from "../engine/game_loop.js";

export let isPaused = false;
const pauseMenu = document.getElementById("pauseMenu");
const continueButton = document.getElementById("continueButton");
const restartButton = document.getElementById("restartButton");
const restartGameOver = document.createElement('button');
let menuOptions = [continueButton, restartButton];
let selectedOptionIndex = 0;

function highlightSelectedOption() {
  menuOptions.forEach((button, index) => {
    if (index === selectedOptionIndex) {
      button.style.backgroundColor = "red";
      button.style.color = "black";
    } else {
      button.style.backgroundColor = "";
      button.style.color = "black";
    }
  });
}

function pauseGame() {
  isPaused = true;
  pauseMenu.classList.remove("hidden");
  cancelAnimationFrame(gameLoop); 
  selectedOptionIndex = 0; 
  highlightSelectedOption(); 
}

function continueGame() {
  isPaused = false;
  pauseMenu.classList.add("hidden");
  requestAnimationFrame(gameLoop); 
}

export function restartGame() {
  isPaused = false;
  pauseMenu.classList.add("hidden");
  document.querySelector(".map").remove();
  playerState.direction = "down";
  init();
}

let gameOverDiv = document.createElement('div');

export function initGameOver(){
  const map = document.querySelector(".map");
  if (gameOverDiv.firstChild) gameOverDiv.firstChild.remove();
  gameOverDiv.id = "gameOverScreen";
  gameOverDiv.style.display = "none";
  let gameOverContent = document.createElement('div');
  gameOverContent.className = "game-over-content";
  let h1 = document.createElement('h1');
  h1.textContent = "Game Over";
  restartGameOver.id = "restartGameOver";
  restartGameOver.textContent = "Restart";
  gameOverContent.appendChild(h1);
  gameOverContent.appendChild(restartGameOver);
  gameOverDiv.appendChild(gameOverContent);
  map.appendChild(gameOverDiv);
}

export function gameOver() {
  isPaused = true;
  gameOverDiv.style.display = "flex";
  cancelAnimationFrame(gameLoop);
  restartGameOver.style.backgroundColor = "red";
  restartGameOver.style.color = "black";
}

function handleMenuNavigation(event) {
  if (!isPaused) return;
  if (event.key === "ArrowDown") {
    selectedOptionIndex = (selectedOptionIndex + 1) % menuOptions.length;
    highlightSelectedOption();
  } else if (event.key === "ArrowUp") {
    selectedOptionIndex =
      (selectedOptionIndex - 1 + menuOptions.length) % menuOptions.length;
    highlightSelectedOption();
  } else if (event.key === "Enter") {
    menuOptions[selectedOptionIndex].click();
  }
}

menuOptions.forEach((button, index) => {
  button.addEventListener("mouseenter", () => {
    selectedOptionIndex = index; 
    highlightSelectedOption();
  });
});

continueButton.addEventListener("click", continueGame);
restartButton.addEventListener("click", restartGame);
restartGameOver.addEventListener("click", restartGame);

document.addEventListener("keydown", (event) => {
  if (gameOverScreen.style.display === "flex") {
    return
  }
  if (event.key === "Escape") {
    if (isPaused) {
      continueGame();
    } else {
      pauseGame();
    }
  } else {
    handleMenuNavigation(event);
  }
});