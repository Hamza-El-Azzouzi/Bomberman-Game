const player = document.getElementById('player');
const frameWidth = 48; 
const frameHeight = 32; 
const spriteDirections = {
    down: 0, 
    left: 1, 
    right: 2, 
    up: 3, 
};

const playerState = {
    x: 100,
    y: 100,
    speed: 200, 
    direction: 'down', 
    frame: 0, 
};

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
};
let lastFrameTime = 0;
export function update(deltaTime) {
    let moving = false;
    if (keys.ArrowUp || keys.w) {
        playerState.y -= playerState.speed * deltaTime;
        playerState.direction = 'up';
        moving = true;
    }
    if (keys.ArrowDown || keys.s) {
        playerState.y += playerState.speed * deltaTime;
        playerState.direction = 'down';
        moving = true;
    }
    if (keys.ArrowLeft || keys.a) {
        playerState.x -= playerState.speed * deltaTime;
        playerState.direction = 'left';
        moving = true;
    }
    if (keys.ArrowRight || keys.d) {
        playerState.x += playerState.speed * deltaTime;
        playerState.direction = 'right';
        moving = true;
    }
    if (moving) {
        if (performance.now() - lastFrameTime > 200) { 
            playerState.frame = (playerState.frame + 1) % 4; 
            lastFrameTime = performance.now();
        }
    } else {
        playerState.frame = 0;
    }
}

export function render() {
    player.style.transform = `translate(${playerState.x}px, ${playerState.y}px)`;
    const row = spriteDirections[playerState.direction];
    player.style.backgroundPosition = `-${playerState.frame * frameWidth}px -${row * frameHeight}px`;
}

document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});
document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});