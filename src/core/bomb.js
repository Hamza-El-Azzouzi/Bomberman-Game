let activeBomb = null; 
const container = document.querySelector('.map');

export function placeBomb(playerState) {
    if (activeBomb) return;

    const bombX = Math.round(playerState.x / 50);
    const bombY = Math.round(playerState.y / 50);

    const bomb = document.createElement("div");
    bomb.className = "bomb";
    bomb.style.transform = `translate3d(${bombX * 50}px, ${bombY * 50}px, 0)`;
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
    explosion.style.transform = `translate3d(${bombX * 50}px, ${bombY * 50}px, 0)`;
    container.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);
}
