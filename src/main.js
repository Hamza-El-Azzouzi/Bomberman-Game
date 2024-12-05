import { gameLoop } from "./engine/game_loop.js";
import { MapGenerator } from "./core/map.js";
import { checkResizing } from "./utils/check_resizing.js";
import { placeEnemies } from "./core/enemy.js";

export let Tils

export function init() {
  Tils = MapGenerator();

  checkResizing();

  placeEnemies();
  gameLoop();
}

init();