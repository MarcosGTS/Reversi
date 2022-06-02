export default class reversiGame {
    
    constructor (players = ["white", "black"], state = [], history = []) {
        this.players = players;
        this.dimensions = {x: 8, y: 8};
        this.state = state;
        this.history = history
    }

    getState() {
        return this.state;
    }

    getdimensions() {
        return this.dimensions;
    }

    getPoints(color) {
        return this.state.filter(e => e.color == color).length;
    }

    getHistory() {
        return [...this.history];
    }

    getPlayers() {
        return this.players;
    }

    getCurrentPlayer() {
        return this.players[0];
    }

    getCell(state, position) {
        if (!position) return undefined;
        return state.find(e => e.x == position.x && e.y  == position.y);
    }

    addPositions(p1, p2) {
        return {x: p1.x + p2.x, y: p1.y + p2.y};
    }

    getWinner() {
        let {state, dimensions} = this; 
        let maxPoints = dimensions.x * dimensions.y;
        
        if (!this.checkSkipCase() && state.length < maxPoints)
            return "";
        
        if (this.getPoints("black") > this.getPoints("white")) {
            return "black";
        } else if (this.getPoints("black") < this.getPoints("white")) {
            return "white";
        }
            
        return "tie";
    }

    checkSkipCase() {
        const history = this.getHistory();
        const last = history[1];
        if (!last) return false;

        const crrValidPlays = this.getValidPlays();
        const lastValidPlays = last.getValidPlays();
        
        return crrValidPlays.length == 0 && lastValidPlays.length == 0;
    }

    skip() {
        let crrPlayer = this.getPlayers().shift();
        this.getPlayers().push(crrPlayer);

        return new reversiGame (
            [...(this.getPlayers())],
            [...(this.getState())], 
            [this, ...this.getHistory()]
        );
    }

    play(position) {
        
        if (!position) return this.skip();

        let positions = this.isValidPlay(position)
        if (positions.length == 0) return this;

        this.capture(positions, this.players[0]);
        this.state.push({x: position.x, y: position.y, color: this.players[0]});
        
        let crrPlayer = this.players.shift();
        this.players.push(crrPlayer);

        return new reversiGame([...this.players], [...this.state], [this, ...this.history]);
    }

    capture(capturedCells, color) {
        let state = this.getState();

        for (let cell of capturedCells) {
            this.getCell(state, cell).color = color;
        }
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

        return plays;
    }

    isValidPlay(position) {
        let {getCell, addPositions, state, players} = this;
        let crrPlayer = this.getCurrentPlayer();
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

    static initializeGame() {
        let initialState = [
            {x:3, y:3, color: "black"},
            {x:4, y:3, color: "white"},
            {x:3, y:4, color: "white"},
            {x:4, y:4, color: "black"}
        ];
        
        let players = ["white", "black"];

        if (Math.random() < 0.5) players = ["black", "white"]; 
        
        return new reversiGame(players, initialState);
    }

}