let activeBomb = null; 
const frameWidth = 50;
const container = document.querySelector('.map');

export function placeBomb(playerState) {
    if (activeBomb) return;

    const bombX = Math.round(playerState.x / frameWidth);
    const bombY = Math.round(playerState.y / frameWidth);

    const bomb = document.createElement("div");
    bomb.className = "bomb";
    bomb.style.transform = `translate3d(${bombX * frameWidth}px, ${bombY * frameWidth}px, 0)`;
    container.appendChild(bomb);

    activeBomb = bomb;

    setTimeout(() => {
        bomb.remove(); 
        showExplosionEffect(bombX, bombY); 
        activeBomb = null; 
    }, 3000);
}

function showExplosionEffect(bombX, bombY) {
    const explosion = document.createElement("div");
    explosion.className = "explosion";
    explosion.style.transform = `translate3d(${bombX * frameWidth}px, ${bombY * frameWidth}px, 0)`;
    container.appendChild(explosion);

    let frame = 0;
    let row = 0;
    const totalFrames = 16;
    const frameInterval = 100;

    const interval = setInterval(() => {
        if (frame >= totalFrames) {
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
