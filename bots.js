export function randomAi(game) {
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

export function miniMaxAi(game) {

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
        let legalMoves = newGame.getValidPlays();

        for (let move of legalMoves) {
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
        let legalMoves = newGame.getValidPlays();
            
        for (let move of legalMoves) {
            let newState = newGame.play(move);
            let newScore = maximize(newState, depth - 1);
            score = Math.min(score, newScore);
        }
        
        return score;
    }

    return result.move;
}

/*
A forma de avaliar o game-state funciona, especificamente, nesse jogo
ja que toda a conquista do adversario prejudica o jogador pricipal

se o jogo tivesse mecanicas diferentes seria necessario cria codicoes para 
avaliar o jogo do adversario
*/

export function miniMaxPruningAi(game) {

    function miniMaxAB(game, depth, maximizing, alpha = -Infinity, beta = Infinity) {
        
        if (game.getWinner() == "black") return -1000;
        if (game.getWinner() == "white") return 1000;
        if (game.getWinner() == "tie") return 0;

        if (depth == 0) {
            return heuristicFunction(game, "white");
        }

        if (game.getValidPlays().length == 0) {
            console.log('Ai skip')
            let newState = game.skip();
            return miniMaxAB(newState, depth - 1, !maximizing, alpha, beta)
        }

        if (maximizing) {
            let maxScore = -Infinity; 
            
            for (let move of game.getValidPlays()) {
                let newState = game.play(move);
                let newScore = miniMaxAB(newState, depth - 1, !maximizing, alpha, beta)
                maxScore = Math.max(maxScore, newScore);
                alpha = Math.max(alpha, newScore);
                
                if (beta <= alpha) 
                    break;
            }

            return maxScore;
        } else {
            let minScore = Infinity; 
            
            for (let move of game.getValidPlays()) {
                let newState = game.play(move);
                let newScore = miniMaxAB(newState, depth - 1, !maximizing, alpha, beta)
                minScore = Math.min(minScore, newScore);
                beta = Math.min(alpha, newScore);
                
                if (beta <= alpha) 
                    break;
            }

            return minScore;
        }
    }

    let result = {move: undefined, score: -Infinity};
    let depth = 4;

    for (let move of game.getValidPlays()) {
    
        let newState = game.play(move);
        let score = miniMaxAB(newState, depth, false);
        
        if (score > result.score) {
            result.score = score;
            result.move = move;
        }
    }

    console.log("Escolhido: ", result)

    return result.move;
}