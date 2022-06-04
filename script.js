import {renderBoard, renderHints} from "./renders.js";
import { randomAi, miniMaxAi,miniMaxPruningAi } from "./bots.js";
import reversiGame from "./reversi.js";

function resetGame (game) { 
    const canvas = document.querySelector(".board");
    const playBtn = document.querySelector(".play");

    game = reversiGame.initializeGame();
    playBtn.addEventListener("click", () => resetGame(game));
    canvas.addEventListener("click", (e) => translateInput(e, game));
    
    updateVisuals(game);
}

function translateInput(event) {
    const canvas = document.querySelector(".board");

    let xOffSet = event.offsetX;
    let yOffSet = event.offsetY;

    let dimensions = canvas.width / 8;
    let x = Math.floor(xOffSet / dimensions);
    let y = Math.floor(yOffSet / dimensions);
    
    return {x, y};
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

let canvas = document.querySelector(".board");
let GAME;

setupVersusAi(canvas, miniMaxPruningAi);

//helper function
// function randomBots() {
//     let game = reversiGame.initializeGame();
    
//     while (game.getWinner() == "") {
//         let plays = game.getValidPlays()
        
//         if (plays.length == 0) {
//             game = game.skip()
//             continue;
//         }
    
//         let randomplay = plays[Math.floor(Math.random() * plays.length)];
//         game = game.play(randomplay);
//     }
//     console.log(game.getWinner());
//     renderBoard(game.getState(), canvas);
// }

function setupVersusAi(canvas, getComputerMove) {
    let game = reversiGame.initializeGame();

    if (game.getCurrentPlayer() == "white") {
        const botMove = getComputerMove(game);
        game = game.play(botMove);
    }

    //game loop
    updateVisuals(game);

    canvas.addEventListener("click", (e) => {
        
        const playerMove = translateInput(e);

        if (game.getValidPlays(playerMove).length > 0) {
            game = game.play(playerMove); 
        } else {
            game = game.skip();
            console.log("Player skip");
        }

        updateVisuals(game);

        const botMove = getComputerMove(game);
        if (botMove) {
            game = game.play(botMove);
        } else {
            game = game.skip();
            console.log("Bot skip")
        }
        
        updateVisuals(game); 
    })

}

