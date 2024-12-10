import { playerState } from "../core/player.js";

export class FPSMonitor {
    constructor() {
      this.lastUpdateTime = performance.now();
      this.frameCount = 0;
      this.fps = 0;
      this.keysPressed = {};
      this.debugOverlay = null;  
      this.initOverlay();
      this.setupKeyListeners();
    }
  
    initOverlay() {
      this.debugOverlay = document.createElement("div");
      this.debugOverlay.style.position = "fixed";
      this.debugOverlay.style.top = "10px";
      this.debugOverlay.style.left = "10px";
      this.debugOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      this.debugOverlay.style.color = "white";
      this.debugOverlay.style.padding = "10px";
      this.debugOverlay.style.borderRadius = "5px";
      this.debugOverlay.style.fontSize = "14px";
      this.debugOverlay.style.zIndex = 1000;
      document.body.appendChild(this.debugOverlay);
    }
  
    setupKeyListeners() {
      window.addEventListener("keydown", (event) => {
        this.keysPressed[event.key] = true;
      });
  
      window.addEventListener("keyup", (event) => {
        delete this.keysPressed[event.key];
      });
    }
  
    getMemoryUsage() {
      if (performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
        return `Memory: ${(usedJSHeapSize / 1024 / 1024).toFixed(2)} MB / ${(totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`;
      }
      return "Memory: Not Supported";
    }
  
    update(currentTime) {
      this.frameCount++;
  
      if (currentTime - this.lastUpdateTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastUpdateTime = currentTime;
      }
  
      this.render();
    }
  
    render() {
      const memoryUsage = this.getMemoryUsage();
      const pressedKeys = Object.keys(this.keysPressed).join(", ") || "None";
  
      this.debugOverlay.innerHTML = `
        <strong>Debug Info</strong><br>
        FPS: ${this.fps}<br>
        ${memoryUsage}<br>
        Keys Pressed: ${pressedKeys}<br>
        Player X: ${Math.round(playerState.x)}<br>
        Player Y: ${Math.round(playerState.y)}<br>
        Direction: ${playerState.direction}<br>
        Animation Frame: ${playerState.frame}
      `;
    }
  }
  