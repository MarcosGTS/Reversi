export function renderBoard(gameState, canvas) {
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
    
    for(let y = 0; y < 8; y++ ) {
    for(let x = 0; x < 8; x++ ) {
        ctx.fillStyle = "#008200";
        
        if ((x + y) % 2 == 0)
            ctx.fillStyle = "#008a00";
        
        ctx.fillRect(x * cellDimension, y * cellDimension, cellDimension, cellDimension);
    }}

    for(let cell of gameState) {
        let position = {x: cell.x * cellDimension, y: cell.y * cellDimension};
        drawCell(position, cellDimension, cell.color);
    }
    
}

export function renderHints(hints, canvas) {
    const ctx = canvas.getContext("2d");
    const cellDimension = (canvas.width / 8);

    function drawCell(position, dimension, color) {
        const {x, y} = position;
        
        ctx.lineWidth = 5;
        ctx.strokeStyle = `${color}`;
        ctx.beginPath();
        ctx.arc(x + dimension/2, y + dimension/2, dimension/2 - 20, 0, Math.PI * 2); 
        ctx.stroke()
    }

    for(let cell of hints) {
        let position = {x: cell.x * cellDimension, y: cell.y * cellDimension};
        drawCell(position, cellDimension, "red");
    }
    
}