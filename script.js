import {renderBoard, renderHints} from "./renders.js";
import reversiGame from "./reversi.js";

function resetGame (game) { 
    const canvas = document.querySelector(".board");
    const playBtn = document.querySelector(".play");

    game = reversiGame.initializeGame();
    playBtn.addEventListener("click", () => resetGame(game));
    canvas.addEventListener("click", (e) => translateInput(e, game));
    
    updateVisuals(game);
}

function translateInput(event, game) {
    const canvas = document.querySelector(".board");

    if (game.getWinner() == "") {
        let xOffSet = event.offsetX;
        let yOffSet = event.offsetY;
    
        let dimensions = canvas.width / 8;
        let x = Math.floor(xOffSet / dimensions);
        let y = Math.floor(yOffSet / dimensions);
    
        game = game.play({x, y});
    }

    updateVisuals(game);
}

function updateVisuals(game) {
    const canvas = document.querySelector(".board");

    renderBoard(game.getState(), canvas);
    renderHints(game.getValidPlays(), canvas);
    updateMessage(game);
}

function updateMessage(game) {
   
    function getMessage(state) {
        if (state == "tie") 
        return `Result: <strong>Tie<\strong>`;

        if (state) 
        return `The winner is:<strong>${state}<\strong>`;
    
        return `Current Player: ${game.getCurrentPlayer()}`;
    }

    const gameState = document.querySelector(".game-state");
    const winner = game.getWinner();

    gameState.innerHTML = getMessage(winner);
}

let GAME;
resetGame(GAME);

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

