import {renderBoard, renderHints} from "./renders.js";
import reversiGame from "./reversi.js";

let game = reversiGame.initializeGame();
const canvas = document.querySelector(".board");
const skip = document.querySelector(".skip");

renderBoard(game.getState(), canvas);
renderHints(game.getValidPlays(), canvas);

skip.addEventListener("click",() => {    
    game = game.skip();
    renderBoard(game.getState(), canvas);
    renderHints(game.getValidPlays(), canvas);
    console.log(game.getWinner());
});

canvas.addEventListener("click", (e) => {
    console.log(game.getWinner());
    console.log(game.history);

    if (game.getWinner() == "") {
        let xOffSet = e.offsetX;
        let yOffSet = e.offsetY;
    
        let dimensions = canvas.width / 8;
        let x = Math.floor(xOffSet / dimensions);
        let y = Math.floor(yOffSet / dimensions);
    
        game = game.play({x, y});
        renderBoard(game.getState(), canvas);
        renderHints(game.getValidPlays(), canvas);
    }
    
})

//helper function
function randomBots() {
    let game = reversiGame.initializeGame();
    
    while (game.getWinner() == "") {
        let plays = game.getValidPlays()
        
        if (plays.length == 0) {
            game = game.skip()
            continue;
        }
    
        let randomplay = plays[Math.floor(Math.random() * plays.length)];
        game = game.play(randomplay);
    }
    console.log(game.getWinner());
    renderBoard(game.getState(), canvas);
}

randomBots();