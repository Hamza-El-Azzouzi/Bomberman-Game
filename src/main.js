import { initMap, MapGenerator } from "./core/map.js";
import { checkResizing } from "./utils/check_resizing.js";
import { placeEnemies } from "./core/enemy.js";
import { gameLoop } from "./engine/game_loop.js";


export let Tils

export function init() {
  initMap();
  Tils = MapGenerator();
  checkResizing();
  placeEnemies();
  gameLoop();
}

init();