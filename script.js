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
        let positions = this.isValidPlay(position)
        if (positions.length == 0) return this;
        
        
        this.state.push({x: position.x, y: position.y, color: this.players[0]});
        this.capture(positions, this.players[0]);
        
        let crrPlayer = this.players.shift();
        this.players.push(crrPlayer);

        return new reversiGame([...this.players], [...this.state]);
    }

    isValidPlay(position) {
        let {getCell, addPositions, state, players} = this;
        let crrPlayer = players[0];
        let positions = [];

        if (getCell(state, position)) return [];

        function linearSearch(position, direction) {
            let currentCell = getCell(state, position);
            if (!currentCell) return [];
            if (currentCell.color == crrPlayer) return [position]; 
            let tailResult = linearSearch(addPositions(position, direction), direction)
            return tailResult[0] ? [position, ...tailResult] : []
        }
        
        for (let sections = 0; sections < 2; sections += 0.25) {
            let x = Math.round(Math.cos(Math.PI * sections));
            let y = Math.round(Math.sin(Math.PI * sections));
            let adjacentPos = addPositions(position, {x, y});
            let adjacentCell = getCell(state, adjacentPos);

            if (adjacentCell && adjacentCell.color != crrPlayer) {
                let linearResult = linearSearch(adjacentPos, {x, y});
                positions = [...positions, ...linearResult];
            }      
        }

        return positions;
    } 

    getValidPlays() {
       
        let plays = [];
        let {dimensions} = this;

        for (let y = 0; y < dimensions.y; y++) {
        for (let x = 0; x < dimensions.x; x++) {
            if (this.isValidPlay({x, y})[0]) {
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

    capture(capturedCells, color) {
        let state = this.getState();

        for (let cell of capturedCells) {
            //updating color 
            
            this.getCell(state, cell).color = color;
        }
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

function renderHints(hints) {
    const canvas = document.querySelector(".board");
    const ctx = canvas.getContext("2d");
    const cellDimension = (canvas.width / 8);

    function drawCell(position, dimension, color) {
        const {x, y} = position;
        
        ctx.fillStyle = `${color}`;
        ctx.beginPath();
        ctx.arc(x + dimension/2, y + dimension/2, dimension/2 - 20, 0, Math.PI * 2); 
        ctx.fill()
    }

    for(let cell of hints) {
        let position = {x: cell.x * cellDimension, y: cell.y * cellDimension};
        drawCell(position, cellDimension, "red");
    }
    
}

let initialState = [
    {x: 3, y:3, color: "white"},
    {x: 4, y:3, color: "black"},
    {x: 3, y:4, color: "black"},
    {x: 4, y:4, color: "white"}
];

let game = new reversiGame(["white", "black"], initialState);

renderBoard(game.getState());
renderHints(game.getValidPlays());

const canvas = document.querySelector(".board");

canvas.addEventListener("click", (e) => {
    let xOffSet = e.offsetX;
    let yOffSet = e.offsetY;

    let dimensions = canvas.width / 8;
    let x = Math.floor(xOffSet / dimensions);
    let y = Math.floor(yOffSet / dimensions);
    console.log({x, y});

    game = game.play({x, y});
    renderBoard(game.getState());
    renderHints(game.getValidPlays());
})
