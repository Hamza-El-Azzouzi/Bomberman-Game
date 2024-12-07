import { init } from "../main.js";
import { playerState } from "../core/player.js";
import { gameLoop } from "../engine/game_loop.js";

export let isPaused = false;
const pauseMenu = document.getElementById("pauseMenu");
const continueButton = document.getElementById("continueButton");
const restartButton = document.getElementById("restartButton");
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

function restartGame() {
  isPaused = false;
  pauseMenu.classList.add("hidden");
  document.querySelector(".map").remove();
  playerState.direction = "down";
  init();
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

continueButton.addEventListener("click", continueGame);
restartButton.addEventListener("click", restartGame);

document.addEventListener("keydown", (event) => {
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