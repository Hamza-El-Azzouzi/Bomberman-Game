import { initMap, MapGenerator } from "./core/map.js";
import { checkResizing } from "./utils/check_resizing.js";
import { placeEnemies } from "./core/enemy.js";
import { gameLoop } from "./engine/game_loop.js";
import { setHud } from "./utils/hud.js";

export let Tils

export function init() {
  let intervalId = setInterval(()=>{
    if (document.querySelector(".loading-container")==null){
      clearInterval(intervalId);
    }
  }, 1000);
  initMap();
  setHud();
  Tils = MapGenerator();
  checkResizing();
  placeEnemies();
  gameLoop();
}

init();