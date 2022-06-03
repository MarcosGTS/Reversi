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

        if (game.getValidPlays(playerMove).length > 0) {
            game = game.play(playerMove);
            updateVisuals(game); 
        } else {
            game = game.play();
            console.log("Player skip");
        }

        const botMove = getComputerMove(game);
        game = game.play(botMove);
        
        updateVisuals(game); 
    })

}

function randomAi(game) {
    const playOptions = game.getValidPlays();
    const randomIndex= Math.floor(Math.random() * playOptions.length);
    const randomPlay = playOptions[randomIndex];

    return randomPlay;
}

function heuristicFunction (game, color) {
    const lookup = [
        [99,  -8, 8,  6,  6, 8,  -8, 99],
        [-8, -24,-4, -3, -3,-4, -24, -8],
        [ 8,  -4, 7,  4,  4, 7,  -4,  8],
        [ 6,  -3, 4,  0,  0, 4,  -3,  6],
        [ 6,  -3, 4,  0,  0, 4,  -3,  6],
        [ 8,  -4, 7,  4,  4, 7,  -4,  8],
        [-8, -24,-4, -3, -3,-4, -24, -8],
        [99,  -8, 8,  6,  6, 8,  -8, 99],
    ];

    let score = 0;

    for (let piece of game.getState()) {
        let {x, y} = piece;
        if (piece.color != color) continue; 

        score += lookup[y][x];
    }

    return score;
}

function miniMaxAi(game) {

    let result = {move: undefined, score: -Infinity};
    let depth = 3;

    for (let move of game.getValidPlays()) {
    
        let newState = game.play(move);
        let score = minimize(newState, depth);
        
        if (score > result.score) {
            result.score = score;
            result.move = move;
        }
    }

    console.log("Escolhido: ", result)

    function maximize(newGame, depth) {

        if (newGame.getWinner() == "black") {
            return 1000;
        }else if (newGame.getWinner() == "tie") {
            return 0;
        }


        if (depth <= 0) {
           return heuristicFunction(newGame, "white");
        }
        
        let score = -Infinity;
        
        for (let move of newGame.getValidPlays()) {
            let newState = newGame.play(move);
            let newScore = minimize(newState, depth - 1);
            score = Math.max(score, newScore);
        }

        return score;
    } 

    function minimize(newGame, depth) {
        
        if (newGame.getWinner() == "black") {
            return -1000;
        }else if (newGame.getWinner() == "tie") {
            return 0;
        }

        if (depth <= 0) {
            return -heuristicFunction(newGame, "black");
        }
        
        let score = Infinity;
        
        for (let move of newGame.getValidPlays()) {
            let newState = newGame.play(move);
            let newScore = maximize(newState, depth - 1);
            score = Math.min(score, newScore);
        }

        return score;
    }

    

    return result.move;
}

