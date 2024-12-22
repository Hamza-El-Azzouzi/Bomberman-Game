import { init } from "../main.js";
import { playerState } from "../utils/check_resizing.js";
import { gameLoop } from "../engine/game_loop.js";
import { resetPlayer } from "../core/player.js";

export let isPaused = false;
const pauseMenu = document.getElementById("pauseMenu");
const gameOverDiv = document.getElementById("gameOverScreen");
const continueButton = document.getElementById("continueButton");
const restartButton = document.getElementById("restartButton");
const restartGameOver = document.getElementById("restartGameOver");
const winnerScreen = document.getElementById("winnerScreen");
const playAgainButton = document.getElementById("playAgainButton");
const container = document.querySelector(".container");
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

export function Winner() {
  isPaused = true;
  winnerScreen.style.display = "flex";
  container.classList.add("blurred");
  cancelAnimationFrame(gameLoop);
  playAgainButton.style.backgroundColor = "red";
  playAgainButton.style.color = "black";
}

export function pauseGame() {
  container.style.filter = "";
  isPaused = true;
  pauseMenu.classList.remove("hidden");
  container.classList.add("blurred");
  cancelAnimationFrame(gameLoop);
  selectedOptionIndex = 0;
  highlightSelectedOption();
}

function continueGame() {
  isPaused = false;
  pauseMenu.classList.add("hidden");
  container.style.filter = "blur(0px)";
  container.classList.remove("blurred");
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  container.style.filter = "blur(0px)";
  container.classList.remove("blurred");
  isPaused = false;
  pauseMenu.classList.add("hidden");
  gameOverDiv.style.display = "none";
  winnerScreen.style.display = "none";
  document.querySelector(".map").remove();
  playerState.direction = "down";
  resetPlayer();
  init();
}

export function gameOver() {
  isPaused = true;
  gameOverDiv.style.display = "flex";
  container.style.filter = "";
  container.classList.add("blurred");
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
playAgainButton.addEventListener("click", restartGame);

document.addEventListener("keydown", (event) => {
  if (gameOverScreen.style.display === "flex") {
    if (event.key === "Enter"){
      restartGameOver.click();
    }
    return;
  }
  if (!winnerScreen.classList.contains("hidden")){
    if (event.key === "Enter"){
      playAgainButton.click();
    }
    return;
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
