import { gameLoop } from "./engine/game_loop.js";
import { MapGenerator } from "./core/map.js";
import { checkResizing } from "./utils/check_resizing.js";

export const Tils = MapGenerator();

checkResizing()

gameLoop();