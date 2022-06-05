import {renderBoard, renderHints} from "./renders.js";
import { randomAi, miniMaxAi,miniMaxPruningAi } from "./bots.js";
import reversiGame from "./reversi.js";

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

function changeBot() {
    let selector = document.querySelector("#AIs");
    let {selectedIndex}= selector.options;
    let selectedItem = selector.options[selectedIndex].value;
    let selectedAI = randomAi;

    if (selectedItem == "randomAi")  selectedAI = randomAi;
    if (selectedItem == "simpleMinimax") selectedAI = miniMaxAi;
    if (selectedItem == "pruningMinimax") selectedAI = miniMaxPruningAi;
   
    let playBtn = document.querySelector(".play");
    let cloneBtn =playBtn.cloneNode(true);

    cloneBtn.addEventListener("click", () => setupVersusAi(canvas, selectedAI))

    playBtn.parentNode.replaceChild(cloneBtn, playBtn);
};

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
        const areValidMoves = game.getValidPlays().length > 0;
        const isValidMove = game.isValidPlay(playerMove).length > 1;
        
        
        if (!areValidMoves) {
            game = game.skip();
            console.log("Player skip")
        } else if (isValidMove) {
            game = game.play(playerMove);
        }
        
        if (!areValidMoves || isValidMove) {
            const botMove = getComputerMove(game);
            
            if (botMove) {
                game = game.play(botMove);
            } else {
                game = game.skip();
                console.log("Bot skip")
            }
        }
        
        updateVisuals(game); 
    })
}

let canvas = document.querySelector(".board");
let selector = document.querySelector("#AIs");
selector.addEventListener("change", changeBot);

setupVersusAi(canvas, randomAi);
