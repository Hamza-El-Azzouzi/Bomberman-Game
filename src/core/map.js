import { TILE_SIZE,playerState } from '../constants/constants.js';

export function initMap(){
  const container = document.querySelector(".container");
  const map = document.createElement('div');
  map.id = "map";
  map.className = "map";
  const player = document.createElement('div');
  player.id = "player";
  player.className = "player";
  map.append(player)
  container.appendChild(map);
}

export function MapGenerator() {
  const map = document.querySelector('.map');
  const ROWS = 13;
  const COLS = 15;

  const tils = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(0));

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
        tils[i][j] = 1;
      }
    }
  }

  function countConsecutiveBlocks(row, col, isHorizontal) {
    let count = 0;
    if (isHorizontal) {
      for (let j = Math.max(1, col - 2); j <= Math.min(COLS - 2, col + 2); j++) {
        if (tils[row][j] === 2) count++;
      }
    } else {
      for (let i = Math.max(1, row - 2); i <= Math.min(ROWS - 2, row + 2); i++) {
        if (tils[i][col] === 2) count++;
      }
    }
    return count;
  }
  for (let i = 1; i < ROWS - 1; i++) {
    for (let j = 1; j < COLS - 1; j++) {
      if (i % 2 === 0 && j % 2 === 0) {
        tils[i][j] = 1;
        continue;
      }

      const horizontalCount = countConsecutiveBlocks(i, j, true);
      const verticalCount = countConsecutiveBlocks(i, j, false);

      if (horizontalCount < 2 && verticalCount < 2) {
        if (Math.random() < 0.6) {
          tils[i][j] = 2;
        }
      }
    }
  }

  const safeZones = [
    [1, 1], [1, 2], [2, 1],
    [1, COLS - 2], [2, COLS - 2],
    [ROWS - 2, 1], [ROWS - 3, 1],
    [ROWS - 2, COLS - 2], [ROWS - 3, COLS - 2],
  ];

  safeZones.forEach(([row, col]) => {
    tils[row][col] = 0;
  });
  
  const [startRow, startCol] = safeZones[0];
  playerState.x = startCol * TILE_SIZE; 
  playerState.y = startRow * TILE_SIZE; 


  let doorPlaced = false;
  const potentialDoorSpots = [];
  
  for (let i = 2; i < ROWS - 2; i++) {
    for (let j = 2; j < COLS - 2; j++) {
      if (tils[i][j] === 2) {
        potentialDoorSpots.push([i, j]);
      }
    }
  }

  if (potentialDoorSpots.length > 0) {
    const [doorRow, doorCol] = potentialDoorSpots[
      Math.floor(Math.random() * potentialDoorSpots.length)
    ];
    tils[doorRow][doorCol] = 4;
    doorPlaced = true;
  }


  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const block = document.createElement('div');

      switch (tils[i][j]) {
        case 0:
          block.className = 'lands';
          break;
        case 1:
          block.className = 'block';
          break;
        case 2:
          block.className = 'rock';
          break;
        case 4:
          block.className = 'rock';
          block.textContent = "1 "
          break;
      }
      map.appendChild(block);
    }
  }

  return tils;
}
