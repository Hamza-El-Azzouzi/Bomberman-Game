import { render, update } from "../core/player.js";
import { enemies } from "../constants/constants.js";
import { playerState } from "../utils/check_resizing.js";
import { updateEnemies } from "../core/enemy.js";
import { isPaused, Winner } from "../utils/pause_menu.js";

let lastTime = performance.now();

export function gameLoop(currentTime, tils) {
  const door = document.querySelector(".door");
  if (door && enemies.length === 0) {
    let y = +door.getAttribute("y");
    let x = +door.getAttribute("x");
    if (playerState.y === y && playerState.x === x) {
      Winner();
    }
  }

  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  update(deltaTime, tils);
  updateEnemies(deltaTime);
  render();
  
  if (!isPaused) {
    requestAnimationFrame(gameLoop);
  }
}
