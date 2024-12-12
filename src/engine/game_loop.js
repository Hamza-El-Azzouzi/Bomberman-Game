import { render, update, playerState, TILE_SIZE } from "../core/player.js";
import { FPSMonitor } from "./fps_monitor.js";
import { enemies, updateEnemies } from "../core/enemy.js";
import { isPaused, Winner } from "../utils/pause_menu.js";
import { Tils } from "../main.js";

let lastTime = performance.now();
const fpsMonitor = new FPSMonitor();

export function gameLoop(currentTime, tils) {
  const door = document.querySelector(".door")
  if (door && enemies.length === 0) {
    let y = +door.getAttribute("y");
    let x = +door.getAttribute("x");
    if (playerState.y === y && playerState.x ===x){
      Winner();
    }
  }

  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  update(deltaTime, tils);
  updateEnemies(deltaTime);
  render();

  fpsMonitor.update(currentTime);
  if (!isPaused) {
    requestAnimationFrame(gameLoop);
  }
}
