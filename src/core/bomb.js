import { Tils } from "../main.js";
import { checkSurroundingsBombs, checkSurroundingsBombsByEnemy } from "../utils/collision.js";
import { playerState } from "./player.js";
let activeBomb = null;
const frameWidth = 50;
let container;
var rows = 13
var cols = 15
export let bombX = 0
export let bombY = 0
export function placeBomb() {
    container = document.querySelector('.map');
    if (activeBomb) return;

    bombX = Math.round(playerState.x / frameWidth);
    bombY = Math.round(playerState.y / frameWidth);

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
        Tils[bombY][bombX] = 0


    }, 300);
}
function getElementFromGrid(row, col) {
    let mapchlidern = container.children
    const totalCells = rows * cols;

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        throw new Error("Invalid row or column index");
    }
    const index = (row * cols) + col
    if (index >= 0 && index < totalCells) {
       


        if (mapchlidern[index + 1].className === "rock") return mapchlidern[index + 1];

    }
    return null;
}
function getElementByTranslate3D(row, col) {
    const allEnemies = document.querySelectorAll(".enemy");
    for (const enemy of allEnemies) {
        const style = window.getComputedStyle(enemy);
        const transform = style.transform
        if (transform && transform.includes("matrix")) {
            const match = transform.match(/matrix\((.+?)\)/);
            if (match) {
                const [a, b, c, d, tx, ty] = match[1].split(", ").map((v) => parseFloat(v));
                if ((tx < (col + 2) * 50 && tx > (col - 2) * 50) && (ty < (row + 2) * 50 && ty > (row - 2) * 50)) {
                    console.info("good condition worked!")
                    console.log(Tils)
                    enemy.remove()
                    return enemy;
                }
            }
        }
    }
    return null;
}

function showExplosionEffect(bombX, bombY) {
    const explosion = document.createElement("div");
    const surroundingBombe = checkSurroundingsBombs(bombY, bombX, Tils);
    const surroundingEnemy = checkSurroundingsBombsByEnemy(bombY, bombX, Tils)
    console.log(surroundingEnemy)
    //|| surroundingEnemy.left || surroundingEnemy.down || surroundingEnemy.up){
    if (surroundingEnemy.up) {
        getElementByTranslate3D(bombY - 1, bombX);
    }
    if (surroundingEnemy.down) {
        getElementByTranslate3D(bombY + 1, bombX);
    }
    if (surroundingEnemy.left) {
        getElementByTranslate3D(bombY, bombX - 1);
    }
    if (surroundingEnemy.right) {
        getElementByTranslate3D(bombY, bombX + 1);
    }
    
    if (surroundingBombe.up) {
        console.log("here")


        const element = getElementFromGrid(bombY - 1, bombX);
        if (element) {
            
            let decider = "lands"
            if (Tils[bombY-1][bombX] === 4) decider = "door"
            Tils[bombY-1][bombX] = 0
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            setTimeout(() => {
                element.classList.add(decider)
                element.classList.remove("rock-destroy");
            }, 900)

        }
    }
    if (surroundingBombe.down) {

        const element = getElementFromGrid(bombY + 1, bombX);
        if (element) {
            let decider = "lands"
            if ( Tils[bombY+1][bombX]=== 4) decider = "door"

            Tils[bombY+1][bombX] = 0
            element.classList.remove("rock");
            element.classList.add("rock-destroy");

            setTimeout(() => {
                element.classList.add(decider)
                element.classList.remove("rock-destroy");
            }, 900)
        }
    }
    if (surroundingBombe.left) {

        const element = getElementFromGrid(bombY, bombX - 1);

        if (element) {
            let decider = "lands"
           if ( Tils[bombY][bombX-1]=== 4) decider = "door"
           Tils[bombY][bombX-1] = 0
            element.classList.remove("rock");
            element.classList.add("rock-destroy");

            setTimeout(() => {
                element.classList.add(decider)
                element.classList.remove("rock-destroy");
            }, 900)
        }
    }

    if (surroundingBombe.right) {

        const element = getElementFromGrid(bombY, bombX + 1);

        if (element) {
            let decider = "lands"
            if ( Tils[bombY][bombX+1]=== 4) decider = "door"
            Tils[bombY][bombX+1] = 0
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            setTimeout(() => {
                element.classList.add(decider)
                element.classList.remove("rock-destroy");

            }, 900)
        }
    }

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
        if (frame === 4) {
            row++;
            frame = 0;
        }
        explosion.style.backgroundPosition = `-${frame * frameWidth}px -${row * frameWidth}px`;
        frame++;
    }, frameInterval);

}
