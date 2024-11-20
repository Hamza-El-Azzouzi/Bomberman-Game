const map = document.querySelector(".map")

const tils = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,2,0,2,0,2,0,2,0,2,0,0,1],
    [1,0,1,2,2,0,1,2,1,0,1,2,0,1],
    [1,0,1,2,2,0,1,2,1,0,1,2,0,1],
    [1,0,1,2,2,0,1,2,1,0,1,2,0,1],
    [1,0,1,2,2,0,1,2,1,0,1,2,0,1],
    [1,0,1,2,2,0,1,2,1,0,1,2,0,1],
    [1,0,1,2,2,0,1,2,1,0,1,2,0,1],
    [1,0,1,2,2,0,1,2,1,0,1,2,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]
for(let i= 0; i < tils.length ; i++){
    for(let j= 0; j < tils[i].length ; j++){
        const block = document.createElement("div")
        if (tils[i][j]=== 0){
            block.className = "lands"
        }else if (tils[i][j]=== 1){
              block.className = "block"
        }else if (tils[i][j]=== 2){
              block.className = "rock"
        }else if (tils[i][j]=== 3){
              block.className = "door"
        }else if (tils[i][j]=== 4){
              block.className = "enemy"
        }else if (tils[i][j]=== 5){
              block.className = "player"
        }
        map.appendChild(block)
    }

}