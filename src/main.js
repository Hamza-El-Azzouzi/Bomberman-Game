import { gameLoop } from "./engine/game_loop.js";
import { MapGenerator } from "./core/map.js";

export const tils = MapGenerator();

gameLoop();