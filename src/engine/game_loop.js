import { render, update } from "../core/player.js";

let lastTime = 0;
export function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    //const fps = Math.round(1 / deltaTime);
    //console.log("FPS: " + fps)
    update(deltaTime);
    render();
    requestAnimationFrame(gameLoop);
}