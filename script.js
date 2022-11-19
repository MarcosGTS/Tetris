const CELL_SIZE = 30
const FRAME_RATE = 500
const BACKGROUND_COLOR = "darkslategrey"

function render(context, field) {
    for(let row in field) {
        for (let col in field[0]) {
            context.fillStyle = field[row][col] || BACKGROUND_COLOR
            context.strokeStyle = "black"
            context.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            context.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
    }
}

function pickRandom(list) {
    const randomIndex = Math.floor(Math.random() * list.length)
    return list[randomIndex]
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
        deadPieces: [],
        crrPiece:{
            piece: null,
            pos:{x: 2, y: 3,},
            color: "red"
        }

    }

    let pieces = [
        {
            shape: [["*", "*", ""],
                    ["", "*", "*"]],
            color: "red",
        },
        {
            shape: [["", "*", "*"],
                    ["*", "*", ""]],
            color: "aqua",
        },
        {
            shape: [["", "*", ""],
                    ["*", "*", "*"]],
            color: "orange",
        },
        {
            shape: [["*", ""],
                    ["*", ""],
                    ["*", "*"]],
            color: "purple",
        },
        {
            shape: [["", "*"],
                    ["", "*"],
                    ["*", "*"]],
            color: "green",
        },
        {
            shape: [["*", "*"],
                    ["*", "*"]],
            color: "yellow",
        },
        {
            shape: [["*"],
                    ["*"],
                    ["*"], 
                    ["*"]],  
            color: "blue",
        },
    ]

    getNewPiece()

    function placePieceOnField() {
        let {crrPiece} = state
        let fieldPosition = realPosition(crrPiece.piece, crrPiece.pos)

        for (let [col, row] of fieldPosition) { 
            if (state.field[row])    
                state.field[row][col] = state.crrPiece.color
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

        for(let deadPiece of state.deadPieces) {
            let col = deadPiece.x
            let row = deadPiece.y
            if (state.field[row])
                state.field[row][col] = deadPiece.color
        }
    }

    function update() {
        clearField()
        placePieceOnField()
        checkGameOver()
        checkDeadPiece()
    }

    function moveDown() {
        state.crrPiece.pos.y++
    }

    function moveLeft() {
        let {crrPiece} = state
        let positions = realPosition(crrPiece.piece, crrPiece.pos)
        let futurePositions = positions.map(([x, y]) => [x - 1, y])

        if (!positions.some(([x, y]) => x <= 0 ) && !isTouchingDeadPieces(futurePositions))
            state.crrPiece.pos.x--
    }

    function moveRight() {
        let {crrPiece} = state
        let positions = realPosition(crrPiece.piece, crrPiece.pos)
        let futurePositions = positions.map(([x, y]) => [x + 1, y])
        let rightEdge = state.field[0].length - 1
        if (!positions.some(([x, y]) => x >= rightEdge) && !isTouchingDeadPieces(futurePositions))
            state.crrPiece.pos.x++
    }

    function checkDeadPiece() {
        let {crrPiece} = state
        let positions = realPosition(crrPiece.piece, crrPiece.pos)
        let futurePositions = positions.map(([x, y]) => [x, y + 1])
        
        let bottom = state.field.length
        if (futurePositions.some(([x, y]) => y >= bottom || isTouchingDeadPieces(futurePositions))) {
            const deadPieces = positions.map(([x, y]) => {
                return {x, y, color: state.crrPiece.color}
            })
            
            state.deadPieces = [...state.deadPieces, ...deadPieces]
            checkCompleteLines()
            getNewPiece()  
        }    
    }
    
    function isTouchingDeadPieces(pieces) {

        for (let deadPiece of state.deadPieces) {
            let col = deadPiece.x
            let row = deadPiece.y
            for (let [pieceX, pieceY] of pieces) {
                if (pieceX == col && pieceY == row) return true
            }
        }

        return false
    }

    function getNewPiece() {
        let piece = pickRandom(pieces)
        let color = piece.color

        state.crrPiece.piece = piece.shape.map(el => [...el])
        state.crrPiece.color = color
        state.crrPiece.pos.y = -3
    }

    function rotateMatrix(matrix) {
        let newMatrix = []
        
        for (let col = 0; col < matrix[0].length; col++){
            let newRow = []
            for (let row = 0; row < matrix.length; row++){
                newRow.unshift(matrix[row][col])
            }
            newMatrix.push(newRow)
        }

        console.log(newMatrix)
        return newMatrix
    }

    function rotateRigth() {
        let {crrPiece} = state
        let newPiece = rotateMatrix(crrPiece.piece)
        
        let fieldPosition = realPosition(newPiece, crrPiece.pos)
        if (!isTouchingDeadPieces(fieldPosition) && isInsideField(fieldPosition))
            state.crrPiece.piece = newPiece
    }

    function rotateLeft() {
        let {crrPiece} = state
        let newPiece = rotateMatrix(crrPiece.piece)
        newPiece = rotateMatrix(newPiece)
        newPiece = rotateMatrix(newPiece)

        let fieldPosition = realPosition(newPiece, crrPiece.pos)
        if (!isTouchingDeadPieces(fieldPosition) && isInsideField(fieldPosition))
            state.crrPiece.piece = newPiece
    }

    function clearRow(index) {
        let {deadPieces} = state
        deadPieces = deadPieces.filter((piece) => piece.y != index)
        deadPieces = deadPieces.map((piece) => {
            if (piece.y <= index) piece.y++
            return piece
        })
        state.deadPieces = deadPieces
    }

    function checkCompleteLines() {
        let {field} = state
        for (let row of field) {
            let index = field.indexOf(row)
            if (!row.includes("")) {
                clearRow(index)
            }
        }
    }
    
    function realPosition(piece, pos) {
        let fieldPosition = []
        
        for (let row in piece) {
            for (let col in piece[0]) {
                let fieldX = pos.x + parseInt(col)
                let fieldY = pos.y + parseInt(row)
                
                if (piece[row][col])
                    fieldPosition.push([fieldX,fieldY])
            }
        }

        return fieldPosition
    }

    function isInsideField(fieldPosition) {
        for (let [col, row] of fieldPosition) {
            if (col < 0 || col > state.field[0].length - 1) return false
        }

        return true
    }

    function checkGameOver() {
        let isGameOver = state.deadPieces.some((piece) => piece.y < 0)    
        if (isGameOver) state.running = false

    }

    return {
        state,
        update,
        moveRight,
        moveLeft,
        moveDown,
        rotateLeft,
        rotateRigth,
    }
}

let startBtn = document.getElementById("start")
let canvas = document.getElementById("myCanvas")
let context = canvas.getContext('2d')

let game = createGame()
let gameLoop = null;

canvas.height = game.state.field.length * CELL_SIZE
canvas.width = game.state.field[0].length * CELL_SIZE

function SetGameLoop() {
    
    if (!game.state.running) {
        clearTimeout(gameLoop)
        console.log("Game Over")
        return;
    }

    game.moveDown()
    game.update()
    render(context, game.state.field)
    gameLoop = setTimeout(SetGameLoop, FRAME_RATE)
}

start.addEventListener("click", () =>  {
    game = createGame()
    clearTimeout(gameLoop)
    SetGameLoop()
})

document.addEventListener("keydown", (event) => {
    let functions = {
        "ArrowRight": game.moveRight,
        "ArrowLeft": game.moveLeft,
        "ArrowDown": game.moveDown,
        "z": game.rotateLeft,
        "x": game.rotateRigth
    }

    if (functions[event.key]) functions[event.key]();

    game.update()
    render(context, game.state.field)
})