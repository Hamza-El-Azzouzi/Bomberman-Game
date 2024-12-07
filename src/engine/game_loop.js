import { render, update } from "../core/player.js";
import { FPSMonitor } from "./fps_monitor.js";
import { updateEnemies } from "../core/enemy.js";
import { isPaused } from "../utils/pause_menu.js";

let lastTime = performance.now();
const fpsMonitor = new FPSMonitor();

export function gameLoop(currentTime,tils) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  update(deltaTime,tils);
  updateEnemies(deltaTime);
  render();

  fpsMonitor.update(currentTime);
  if (!isPaused){
    requestAnimationFrame(gameLoop);
  }
}