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
    const explosion = document.createElement("div");
    const surrounding = checkSurroundingsBombs(bombY, bombX, Tils);
    // console.info(`bombe placed in : ${bombY} ${bombX}`);
    console.info(surrounding)
    console.log(Tils)
    if (surrounding.up) {
        const element = getElementFromGrid(bombY - 1, bombX);
         console.log(element.dataset.hiddenDoor ?element.dataset.hiddenDoor : "not found" )
        if (element) {;
            console.log(element.dataset.hiddenDoor)
            console.log(`Element at up [${bombX},${bombY}]:`, element);
            element.classList.remove("rock");
            // element.classList.add("lands");
            element.dataset.hiddenDoor === 'true'? element.classList.add("door") : element.classList.add("lands");
        }
    }
    if (surrounding.down) {
        const element = getElementFromGrid(bombY + 1, bombX);
      console.log(element.dataset.hiddenDoor ?element.dataset.hiddenDoor : "not found" )
        if (element) {
            console.log(`Element at down [${bombX},${bombY}]:`, element);
            element.classList.remove("rock");
            // element.classList.add("lands");
            // console.log(element.dataset.hiddenDoor)
            element.dataset.hiddenDoor === 'true'? element.classList.add("door") : element.classList.add("lands");

        }
    }
    if (surrounding.left) {
        const element = getElementFromGrid(bombY, bombX - 1);
        console.log(element.dataset.hiddenDoor ?element.dataset.hiddenDoor : "not found" )
        if (element) {
            const hiddenDoor = element.getAttribute('data-hidden-door');
            console.log(hiddenDoor)
            console.log(`Element at left [${bombX},${bombY}]:`, element);
            element.classList.remove("rock");
            // element.classList.add("lands");
            // console.log(element.dataset.hiddenDoor)
            element.dataset.hiddenDoor === 'true'? element.classList.add("door") : element.classList.add("lands");
        }
    }
    if (surrounding.right) {
        const element = getElementFromGrid(bombY, bombX + 1);
      console.log(element.dataset.hiddenDoor ?element.dataset.hiddenDoor : "not found" )
        if (element) {
            const hiddenDoor = element.getAttribute('data-hidden-door');
            console.log(hiddenDoor)
            console.log(`Element at right [${bombX},${bombY}]:`, element);   
            element.classList.remove("rock");
            // element.classList.add("lands");
            console.log(element.getAttributeNode("data-hidden-door"))
            
            element.dataset.hiddenDoor === 'true'? element.classList.add("door") : element.classList.add("lands");

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
