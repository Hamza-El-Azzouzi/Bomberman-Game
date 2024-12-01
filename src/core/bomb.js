import { Tils } from "../main.js";
import { checkSurroundingsBombs } from "../utils/collision.js";
let activeBomb = null; 
const frameWidth = 50;
const container = document.querySelector('.map');

export function placeBomb(playerState) {
    if (activeBomb) return;
    console.info(Tils)
 
    const bombX = Math.round(playerState.x / frameWidth);
    const bombY = Math.round(playerState.y / frameWidth);

    const bomb = document.createElement("div");
    bomb.className = "bomb";
    bomb.style.transform = `translate3d(${bombX * frameWidth}px, ${bombY * frameWidth}px, 0)`;
    container.appendChild(bomb);
    Tils[bombY][bombX] = 7
    activeBomb = bomb;
    setTimeout(() => {
        bomb.remove(); 
        showExplosionEffect(bombX, bombY); 
        activeBomb = null;
        Tils[bombY][bombX] =0
    }, 3000);
}

function showExplosionEffect(bombX, bombY) {
    const explosion = document.createElement("div");
    const surrounding = checkSurroundingsBombs(bombY, bombX,Tils)
    console.info(`bombe placed in : ${bombX} ${bombY}`)
    console.info(surrounding)
    explosion.className = "explosion";
    explosion.style.transform = `translate3d(${bombX * frameWidth}px, ${bombY * frameWidth}px, 0)`;
    container.appendChild(explosion);

    let frame = 0;
    let row = 0;
    const totalFrames = 16;
    const frameInterval = 100;

    const interval = setInterval(() => {
        if (frame * row >= totalFrames) {
            clearInterval(interval); 
            explosion.remove();
            
            return;
        }
        if (frame === 4){
            row++;
            frame = 0;
        }
        explosion.style.backgroundPosition = `-${frame * frameWidth}px -${row * frameWidth}px`;
        frame++;
    }, frameInterval);

}
