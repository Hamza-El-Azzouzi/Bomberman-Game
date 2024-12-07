import { MapGenerator } from "./core/map.js";
import { checkResizing } from "./utils/check_resizing.js";
import { placeEnemies } from "./core/enemy.js";
import { gameLoop } from "./engine/game_loop.js";

export let Tils = MapGenerator();


console.log("Tils initialized:", Tils);


checkResizing();
placeEnemies();
gameLoop();
