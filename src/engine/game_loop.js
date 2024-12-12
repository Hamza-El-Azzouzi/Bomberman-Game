import { render, update, playerState, TILE_SIZE } from "../core/player.js";
import { FPSMonitor } from "./fps_monitor.js";
import { enemies, updateEnemies } from "../core/enemy.js";
import { isPaused, Winner } from "../utils/pause_menu.js";
import { Tils } from "../main.js";

let lastTime = performance.now();
const fpsMonitor = new FPSMonitor();

export function gameLoop(currentTime, tils) {
  console.log(Tils[Math.round(playerState.y / TILE_SIZE)][Math.round(playerState.x / TILE_SIZE)])
  if (
    enemies.length === 0 &&
    playerState.y % TILE_SIZE === 0 &&
    playerState.x % TILE_SIZE === 0 &&
    Tils[Math.round(playerState.y / TILE_SIZE)][Math.round(playerState.x / TILE_SIZE)] === 4
  ) {
    Winner();
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
