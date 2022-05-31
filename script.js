class reversiGame {
    
    constructor (players = ["white", "black"], state = []) {
        this.players = players;
        this.dimensions = {x: 8, y: 8};
        this.state = state;
    }
    
    getdimensions() {
        return this.dimensions;
    }

    getPoints(color) {
        return this.state.filter(e => e.color != color).length;
    }

    getWinner() {
        let {state, dimensions} = this; 
        let maxPoints = dimensions[0] * dimensions[1];
        
        if (state.length < maxPoints)
            return "";
        
        if (this.getPoints("black") > maxPoints / 2) 
            return "black";

        if (this.getPoints("white") > maxPoints / 2)
            return "white";

        return "tie";
    }

    play(position) {
        if (! this.isValidPosition(position)) return this;

        let crrPlayer = this.players.shift();
        this.players.push(crrPlayer);

        this.recursiveSearch(position, crrPlayer);

        return new reversiGame(this.players, this.state);
    }

    isValidPlay(position) {
        let {getCell, addPositions, state, players} = this;
        let crrPlayer = players[0];

        function linearSearch(position, direction) {
            let currentCell = getCell(state, position);
            if (!currentCell) return false;
            if (currentCell.color == crrPlayer) return true; 
            return linearSearch(addPositions(position, direction), direction)
        }
        
        for (let sections = 0; sections < 2; sections += 0.25) {
            let x = Math.round(Math.cos(Math.PI * sections));
            let y = Math.round(Math.sin(Math.PI * sections));
            let adjacentPos = addPositions(position, {x, y});
            let adjacentCell = getCell(state, adjacentPos);

            if (adjacentCell && adjacentCell.color != crrPlayer) {
                if (linearSearch(adjacentPos, {x, y})) return true;
            }      
        }

        return false;
    } 

    getValidPlays() {
       
        let plays = [];
        let {dimensions} = this;

        for (let y = 0; y < dimensions.y; y++) {
        for (let x = 0; x < dimensions.x; x++) {
            if (!this.getCell(this.state, {x, y}) && this.isValidPlay({x, y})) {
                plays.push({x, y});
            }
        }}

        return plays
    }

    getState() {
        return this.state;
    }

    getCell(state, position) {
        if (!position) return undefined;
        return state.find(e => e.x == position.x && e.y  == position.y);
    }

    recursiveSearch(position, color, type = null) {
        let {getCell, addPositions, state} = this;

        if (type == null) {

            let adjacentPlays = false;

            for (let sections = 0; sections < 2; sections += 0.25) {
                let x = Math.round(Math.cos(Math.PI * sections));
                let y = Math.round(Math.sin(Math.PI * sections));
                let adjacentPos = this.addPositions(position, {x, y});
                
                if (getCell(state, adjacentPos) && getCell(state, adjacentPos).color != color) {
                    //TODO: criar uma lista com todas as posicoes validas para jogars
                    if (this.recursiveSearch( adjacentPos, color, {x, y}))
                        this.getState().push({x: position.x, y: position.y, color});
                }
                  
            }


        } else if (this.isValidPosition(position)) {
            let crrCell = getCell(state, position);
            
            if (!crrCell) return false;
            if (crrCell.color == color) return true;
            
            let recursiveTest = this.recursiveSearch(addPositions(position, type), color, type);
            
            if (recursiveTest) {
                crrCell.color = color;
            } 

            return recursiveTest;
        }

        return false;
    }

    isValidPosition(position) {
        let {dimensions} = this;
    
        return (
            position.x >= 0 && position.x < dimensions.x &&
            position.y >= 0 && position.y < dimensions.y
        );
    }

    addPositions(p1, p2) {
        return {x: p1.x + p2.x, y: p1.y + p2.y};
    }

}

function renderBoard(gameState) {
    const canvas = document.querySelector(".board");
    const ctx = canvas.getContext("2d");
    const cellDimension = (canvas.width / 8);

    function drawCell(position, dimension, color) {
        const {x, y} = position;
        
        ctx.fillStyle = `${color}`;
        ctx.beginPath();
        ctx.arc(x + dimension/2, y + dimension/2, dimension/2 -5, 0, Math.PI * 2); 
        ctx.fill()
    }

    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 500, 500);

    for(let cell of gameState) {
        let position = {x: cell.x * cellDimension, y: cell.y * cellDimension};
        drawCell(position, cellDimension, cell.color);
    }
    
}

let initialState = [
    {x: 3, y:3, color: "white"},
    {x: 4, y:3, color: "black"},
    {x: 3, y:4, color: "white"},
    {x: 4, y:4, color: "black"}
];

let game = new reversiGame(["white", "black"], initialState);

// game = game.play({x: 5, y: 3});
// game = game.play({x: 2, y: 2});
// game = game.play({x: 1, y: 1});

renderBoard(game.getState());