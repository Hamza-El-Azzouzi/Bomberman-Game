import { Tils } from "../main.js";
import { checkSurroundingsBombs } from "../utils/collision.js";
let activeBomb = null;
const frameWidth = 50;
const container = document.querySelector('.map');
var rows = 13
var cols = 15
export function placeBomb(playerState) {
    if (activeBomb) return;
    // console.info(Tils)

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
        Tils[bombY][bombX] = 0
    }, 3000);
}
function getElementFromGrid(row, col) {
    let mapchlidern = container.children
    console.log(mapchlidern)
    const totalCells = rows * cols;

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        throw new Error("Invalid row or column index");
    }
    const index = (row * cols) + col
    if (index >= 0 && index < totalCells) {

        Tils[row][col] = 0
        return mapchlidern[index + 1];
    }
    return null;
}

function showExplosionEffect(bombX, bombY) {
    const directions = [
        { dx: 0, dy: -1, key: 'up' },
        { dx: 0, dy: 1, key: 'down' },
        { dx: -1, dy: 0, key: 'left' },
        { dx: 1, dy: 0, key: 'right' }
    ];
    const explosion = document.createElement("div");
    const surrounding = checkSurroundingsBombs(bombY, bombX, Tils);
    if (surrounding.up) {
        const element = getElementFromGrid(bombY - 1, bombX);
        if (element) {;
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            setTimeout(()=>{
                element.dataset.hiddenDoor === 'true' ? element.classList.add("door") : element.classList.add("lands");
            },900)
            
        }
    }
    if (surrounding.down) {
        const element = getElementFromGrid(bombY + 1, bombX);
        if (element) {
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            setTimeout(()=>{
                element.dataset.hiddenDoor === 'true' ? element.classList.add("door") : element.classList.add("lands");
            },900)
        }
    }
    if (surrounding.left) {
        const element = getElementFromGrid(bombY, bombX - 1);
        if (element) {
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            setTimeout(()=>{
                element.dataset.hiddenDoor === 'true' ? element.classList.add("door") : element.classList.add("lands");
            },900)
        }
    }
    if (surrounding.right) {
        const element = getElementFromGrid(bombY, bombX + 1);
        if (element) {
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            setTimeout(()=>{
                element.dataset.hiddenDoor === 'true' ? element.classList.add("door") : element.classList.add("lands");
            },900)
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
