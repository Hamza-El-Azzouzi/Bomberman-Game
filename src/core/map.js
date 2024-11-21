
export function MapGenerator(){
  const map = document.querySelector(".map");
  var tils = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  
  for (let i = 1; i < tils.length - 1; i++) {
    let blockCount = 0;
    for (let j = 1; j < tils[i].length - 1; j++) {
      if (Math.random() < 0.2 && blockCount < 2) {
        tils[i][j] = 1;
        blockCount++;
      } else if (Math.random() < 0.3 && tils[i][j] !== 1) {
        tils[i][j] = 2;
      }
    }
  }
  
  let doorPlaced = false;
  while (!doorPlaced) {
    const randomRow = Math.floor(Math.random() * (tils.length - 2)) + 1;
    const randomCol = Math.floor(Math.random() * (tils[0].length - 2)) + 1;
  
    if (tils[randomRow][randomCol] === 2) {
      tils[randomRow][randomCol] = 4;
      doorPlaced = true;
    }
  }
  for (let i = 0; i < tils.length; i++) {
    for (let j = 0; j < tils[i].length; j++) {
      const block = document.createElement("div");
      block.className =
        tils[i][j] === 0
          ? "lands"
          : tils[i][j] === 1
          ? "block"
          : tils[i][j] === 2 || tils[i][j] === 4
          ? "rock"
          : "door";
      if (tils[i][j] === 4) block.dataset.hiddenDoor = "true";
      map.appendChild(block);
    }
  }
  
  document.querySelectorAll(".rock").forEach((rock) => {
    rock.addEventListener("click", () => {
      if (rock.dataset.hiddenDoor === "true") {
        rock.className = "door";
        rock.textContent = "🚪";
      }
    });
  });

  return tils
}




