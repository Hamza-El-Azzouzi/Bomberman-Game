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
    // console.log(mapchlidern)
    const totalCells = rows * cols;

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        throw new Error("Invalid row or column index");
    }
    const index = (row * cols) + col
    if (index >= 0 && index < totalCells) {

        Tils[row][col] = 0
        // console.log(mapchlidern[index+1])
        if (mapchlidern[index + 1].className === "rock" || mapchlidern[index + 1].className === "enemy" )return mapchlidern[index + 1];
        
    }
    return null;
}
function getElementByTranslate3D(x, y,tile) {
    // Get all elements with a translate3D transform
    console.log(y,x)
    const allEnemies = document.querySelectorAll(".enemy");
    for (const enemy of allEnemies) {
        const style = window.getComputedStyle(enemy);
        const transform = style.transform || style.webkitTransform || style.mozTransform;
        // console.log(transform)
        if (transform && transform.includes("matrix")) {
            // Extract matrix values
            const match = transform.match(/matrix\((.+?)\)/);
            if (match) {
                const [a, b, c, d, tx, ty] = match[1].split(", ").map((v) => parseFloat(v));
                // console.log([a, b, c, d, tx, ty])
                // Compare coordinates
                if (tx === y && ty === x) {

                    return enemy; // Return the matched enemy element
                }
            }
        }
    }
    return null;// No element found
}

function showExplosionEffect(bombX, bombY) {
    const explosion = document.createElement("div");
    const surroundingBombe = checkSurroundingsBombs(bombY, bombX, Tils);
    // console.log(Tils)
    const surroundingEnemy = checkSurroundingsBombsByEnemy(bombY,bombX,Tils)
    // console.log(surroundingEnemy)

    if (surroundingBombe.up || surroundingEnemy.up ) {
        const enemy = getElementByTranslate3D(50*(bombY - 1), 50*bombX);
        console.log("2nd up :\n",Tils)
        if (enemy){
            Tils[bombY-1][bombX] = 0
            // console.log(enemy)
            enemy.remove()
        }
        // Tils[bombY-1][bombX] = 0
        // console.log( "up",Tils[bombY-1][bombX] )
        console.log(Tils)
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
    if (surroundingBombe.down || surroundingEnemy.down) {
        // if (surroundingEnemy.down) Tils[bombY + 1][bombX] = 0
        const enemy = getElementByTranslate3D(50*(bombY + 1), 50*bombX);
        console.log("2nd down:\n",Tils)
        if (enemy !== null){
            Tils[bombY+1][bombX] = 0
            // console.log(enemy)
            enemy.remove()
        }
        // // console.log(Tils)
        // Tils[bombY+1][bombX] = 0;
        // console.log("down",Tils[bombY+1][bombX])
        console.log(Tils)

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
    if (surroundingBombe.left || surroundingEnemy.left) {
        const enemy = getElementByTranslate3D(50*bombY, 50*(bombX-1));
        console.log("2nd left:\n",Tils)
        if(enemy !== null){
            Tils[bombY][bombX-1] = 0
            // console.log(enemy)
            enemy.remove()
        }
        // Tils[bombY][bombX-1] = 0;
        // console.log("left",Tils[bombY][bombX-1])
        console.log(Tils)
        
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
    if (surroundingBombe.right || surroundingEnemy.right) {
        const enemy = getElementByTranslate3D(50*bombY, 50*(bombX + 1));
        console.log("2nd right:\n",Tils)
        // console.log(Tils)
        if (enemy !== null){
            Tils[bombY][bombX+1] = 0
            // console.log(enemy)
            enemy.remove()
        }
        // Tils[bombY][bombX+1] = 0
        // console.log("right" ,Tils[bombY][bombX+1])
        console.log(Tils)
     
        const element = getElementFromGrid(bombY, bombX+1);

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
