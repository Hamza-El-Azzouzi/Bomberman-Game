import { render, update } from "../core/player.js";
import { FPSMonitor } from "./fps_monitor.js";

let lastTime = performance.now();
const fpsMonitor = new FPSMonitor();

export function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  update(deltaTime);
  render();

  fpsMonitor.update(currentTime);

  requestAnimationFrame(gameLoop);
}