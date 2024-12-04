import { gameLoop } from "./engine/game_loop.js";
import { MapGenerator } from "./core/map.js";
import { checkResizing } from "./utils/check_resizing.js";
import { placeEnemies } from "./core/enemy.js";

export const Tils = MapGenerator();

checkResizing()

placeEnemies();
gameLoop();