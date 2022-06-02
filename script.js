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

setupVersusAi(canvas, miniMaxAi);



//setupVersusAi(canvas, GAME, randomAi);

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

        console.log(playerMove)
        if (game.getValidPlays(playerMove).length > 0) {
            game = game.play(playerMove);
            updateVisuals(game); 
        
            const botMove = getComputerMove(game);
            game = game.play(botMove);
            console.log(botMove);
        }
        
        updateVisuals(game); 
    })

}

function randomAi(game) {
    const playOptions = game.getValidPlays();
    const randomIndex= Math.floor(Math.random() * playOptions.length);
    const randomPlay = playOptions[randomIndex];

    return randomPlay;
}

function miniMaxAi(game) {

    function maximize(newGame, depth) {

        if (depth <= 0) {
            return newGame.getPoints("white")
        }
        
        let score = -Infinity;
        
        for (let move of newGame.getValidPlays()) {
            let newState = newGame.play(move);
            score = Math.max(score, minimize(newState, depth - 1))
        }

        return score;
    } 

    function minimize(newGame, depth) {
        if (depth <= 0) {
            return newGame.getPoints("black")
        }
        
        let score = Infinity;
        
        for (let move of newGame.getValidPlays()) {
            let newState = newGame.play(move);
            console.log(newGame.getCurrentPlayer());
            score = Math.min(score, maximize(newState, depth - 1))
        }

        return score;
    }

    let result = {move: undefined, score: -Infinity};

    for (let move of game.getValidPlays()) {
    
        let newState = game.play(move);
        let score = minimize(newState, 3);

        if (score > result.score) {
            result.score = score;
            result.move = move;
            //console.log(result);
        }
    }

    return result.move;
}

