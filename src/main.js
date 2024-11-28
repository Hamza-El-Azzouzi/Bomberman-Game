import { gameLoop } from "./engine/game_loop.js";
import { MapGenerator } from "./core/map.js";

export const Tils = MapGenerator();
gameLoop();