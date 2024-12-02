import { render, update } from "../core/player.js";
import { FPSMonitor } from "./fps_monitor.js";

let lastTime = performance.now();
const fpsMonitor = new FPSMonitor();

export function gameLoop(currentTime,tils) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  update(deltaTime,tils);
  render();

  fpsMonitor.update(currentTime);

  requestAnimationFrame(gameLoop);
}