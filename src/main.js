import { initMap, MapGenerator } from "./core/map.js";
import { checkResizing } from "./utils/check_resizing.js";
import { placeEnemies } from "./core/enemy.js";
import { gameLoop } from "./engine/game_loop.js";
import { setHud } from "./utils/hud.js";

export let Tils

export function init() {
  setInterval(() => {
    if (document.querySelector(".loading-container") == null) {
      return
    }
  }, 1000);
  initMap();
  setHud();
  Tils = MapGenerator();
  placeEnemies();
  console.log("2")
  checkResizing();
  gameLoop();
}

init();