



const CELL_SIZE = 30
const FRAME_RATE = 1000

function render(context, field) {
    for(let row in field) {
        for (let col in field[0]) {
            context.fillStyle = field[row][col] || "white"
            context.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
    }
}

function createGame() {
    let state = {
        running: true,
        field :[
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],],
        deadPiecesPos: [],
        crrPiece:{
            "piece": null,
            "x": 2,
            "y": 3,
        }

    }

    let pieces = {
        "s":[["red","red", ""],
             ["", "red","red"],
             ["", "", ""]],
        "l":[["blue","", ""],
             ["blue", "",""],
             ["blue", "blue", ""]],
    }

    state.crrPiece.piece = pieces.l;

    function placePieceOnField() {
        let fieldPosition = realPosition();

        for (let [col, row] of fieldPosition) {  
            state.field[row][col] = "red"
        }
    }

    function clearField() {
        state.field = [
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],]

        for(let [col, row] of state.deadPiecesPos) {
            state.field[row][col] = "black"
        }
    }

    function update() {
        checkDeadPiece()
        clearField()
        placePieceOnField()
    }

    function moveDown() {
        state.crrPiece.y++
    }

    function moveLeft() {
        let positions = realPosition()
        let futurePositions = positions.map(([x, y]) => [x - 1, y])

        if (!positions.some(([x, y]) => x <= 0 ) && !isTouchingDeadPieces(futurePositions))
            state.crrPiece.x--
    }

    function moveRight() {
        let positions = realPosition()
        let futurePositions = positions.map(([x, y]) => [x + 1, y])
        let rightEdge = state.field[0].length - 1
        if (!positions.some(([x, y]) => x >= rightEdge) && !isTouchingDeadPieces(futurePositions))
            state.crrPiece.x++
    }

    function checkDeadPiece() {
        let positions = realPosition()
        let futurePositions = positions.map(([x, y]) => [x, y + 1])
        
        let bottom = state.field.length - 1
        if (futurePositions.some(([x, y]) => y >= bottom || isTouchingDeadPieces(futurePositions))) {
            state.deadPiecesPos = [...state.deadPiecesPos, ...positions]
            getNewPiece()
        }    
    }
    
    function isTouchingDeadPieces(pieces) {

        for (let [col, row] of state.deadPiecesPos) {
            for (let [pieceX, pieceY] of pieces) {
                if (pieceX == col && pieceY == row) return true
            }
        }

        return false
    }

    function getNewPiece() {
        let piece = pieces.l
        state.crrPiece.piece = piece.map(el => [...el])
        state.crrPiece.y = 0
    }

    function rotatePiece() {
        let {crrPiece} = state
        let piece = []
        
        for (let col = 0; col < crrPiece.piece[0].length; col++){
            let newRow = []
            for (let row = 0; row < crrPiece.piece.length; row++){
                newRow.unshift(crrPiece.piece[row][col])
            }
            piece.push(newRow)
        }
        
        state.crrPiece.piece = piece
    }
    
    function realPosition() {
        let {crrPiece} = state
        let fieldPositions = []
        
        for (let row in crrPiece.piece) {
            for (let col in crrPiece.piece[0]) {
                let fieldX = crrPiece.x + parseInt(col)
                let fieldY = crrPiece.y + parseInt(row)
                
                if (crrPiece.piece[row][col])
                    fieldPositions.push([fieldX,fieldY])
            }
        }

        return fieldPositions
    }

    return {
        state,
        update,
        moveRight,
        moveLeft,
        moveDown,
        rotatePiece,
    }
}

let canvas = document.getElementById("myCanvas")
let context = canvas.getContext('2d')
let game = createGame()

canvas.height = game.state.field.length * CELL_SIZE
canvas.width = game.state.field[0].length * CELL_SIZE

let gameLoop = null;

function SetGameLoop() {
    if (!game.state.running) clearTimeout(gameLoop)
    game.moveDown()
    game.update()
    render(context, game.state.field)
    gameLoop = setTimeout(SetGameLoop, FRAME_RATE)
}

SetGameLoop()

document.addEventListener("keydown", (event) => {
    let functions = {
        "ArrowRight": game.moveRight,
        "ArrowLeft": game.moveLeft,
        "ArrowDown": game.moveDown,
        " ": game.rotatePiece,
    }

    if (functions[event.key]) functions[event.key]();

    game.update()
    render(context, game.state.field)
})