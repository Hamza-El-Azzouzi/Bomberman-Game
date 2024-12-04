import { Tils } from "../main.js";
import { checkSurroundingsBombs, checkSurroundingsBombsByEnemy } from "../utils/collision.js";
import { playerState } from "./player.js";
let activeBomb = null;
const frameWidth = 50;
const container = document.querySelector('.map');
var rows = 13
var cols = 15
export let bombX = 0
export let bombY = 0
export function placeBomb() {
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
        console.log(mapchlidern[index+1])
        if (mapchlidern[index + 1].className === "rock" || mapchlidern[index + 1].className === "enemy" )return mapchlidern[index + 1];
        
    }
    return null;
}

function showExplosionEffect(bombX, bombY) {
    const explosion = document.createElement("div");
    const surrounding = checkSurroundingsBombs(bombY, bombX, Tils);
    console.log(Tils)
    const surroundingEnemy = checkSurroundingsBombsByEnemy(bombY,bombX,Tils)
    console.log(surroundingEnemy)

    if (surrounding.up || surroundingEnemy.up ) {
        const enemy = getElementFromGrid(bombY - 1, bombX);
        console.log(enemy)
        const element = getElementFromGrid(bombY - 1, bombX);
        if (element) {
             let decider =  "lands"
            if ( element.dataset.hiddenDoor === 'true') decider =  "door"
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            setTimeout(()=>{
                element.classList.add(decider)
                element.classList.remove("rock-destroy");
            },900)
            
        }
    }
    if (surrounding.down || surroundingEnemy.down) {
        if (surroundingEnemy.down) Tils[bombY + 1][bombX] = 0
        const enemy = getElementFromGrid(bombY + 1, bombX);
        console.log(enemy)
        const element = getElementFromGrid(bombY + 1, bombX);
        if (element) {
             let decider =  "lands"
            if ( element.dataset.hiddenDoor === 'true') decider =  "door"
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
           
            setTimeout(()=>{
                element.classList.add(decider)
                element.classList.remove("rock-destroy");
            },900)
        }
    }
    if (surrounding.left || surroundingEnemy.left) {
        const element = getElementFromGrid(bombY +1, bombX);
        const enemy = getElementFromGrid(bombY + 1, bombX);
        console.log(enemy)
        if (element) {
            let decider =  "lands"
            if ( element.dataset.hiddenDoor === 'true') decider =  "door"
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
            
            setTimeout(()=>{
                element.classList.add(decider)
                element.classList.remove("rock-destroy");
            },900)
        }
    }
    if (surrounding.right || surroundingEnemy.right) {
        const element = getElementFromGrid(bombY, bombX + 1);
        const enemy = getElementFromGrid(bombY, bombX+1);
        console.log(enemy)
        if (element) {
             let decider =  "lands"
            if ( element.dataset.hiddenDoor === 'true') decider =  "door"
            element.classList.remove("rock");
            element.classList.add("rock-destroy");
           
            setTimeout(()=>{
                element.classList.add(decider)
                element.classList.remove("rock-destroy");
                
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
