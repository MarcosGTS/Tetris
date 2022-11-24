const CELL_SIZE = 22
const QUEUE_MAX = 3
const FRAME_RATE = 500
const HARD_FRAME_RATE = 20
const BACKGROUND_COLOR = "darkslategrey"

function render(context, game) {
    
    const field = game.state.field
    const queue = game.state.queue
    const score = game.state.score
    
    context.clearRect(0, 0, canvas.width, canvas.height)

    for(let row in field) {
        for (let col in field[0]) {
            context.fillStyle = field[row][col] || BACKGROUND_COLOR
            context.strokeStyle = "black"
            context.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            context.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
    }

    for (let i = 0; i < queue.length; i++) {
        let piece = queue[i]

        for(let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[0].length; col++) {
                if (!piece.shape[row][col]) continue
                context.fillStyle = piece.color
                context.strokeStyle = "black"
                context.fillRect((11 + col) * CELL_SIZE , (row + i*5 + 2) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                context.strokeRect((11 + col) * CELL_SIZE , (row + i*5 + 2) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            }
        }
    }

    //Update score 
    let scoreElement = document.getElementById("score")
    scoreElement.innerText = score
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
        score:0,
        crrPiece:{
            piece: null,
            pos:{x: 2, y: 3,},
            color: "red"
        },
        queue: [],

    }

    let pieces = [
        {
            shape: [["" , "*"],
                    ["*", "*"],
                    ["*", ""]],
            color: "red",
        },
        {
            shape: [["*" , ""],
                    ["*", "*"],
                    ["", "*"]],
            color: "aqua",
        },
        {
            shape: [["*", ""],
                    ["*", "*"],
                    ["*", ""]],
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

    //Initial queue
    queuePiece()
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
        if (state.running == false) return
        clearField()
        placePieceOnField()
        checkGameOver()
    }

    function moveDown() {
        const {crrPiece} = state
        checkDeadPiece()
        crrPiece.pos.y++
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
            return   
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

    function queuePiece() {
        while (state.queue.length < QUEUE_MAX) {
            let piece = pickRandom(pieces)
            if (!state.queue.includes(piece)) {
                state.queue.push(piece)
            }
        }
    }

    function getNewPiece() {
        let piece = state.queue.shift()
        let color = piece.color

        state.crrPiece.piece = piece.shape.map(el => [...el])
        state.crrPiece.color = color
        state.crrPiece.pos.x = Math.floor(state.field[0].length/2) 
        state.crrPiece.pos.y = -3

        queuePiece()
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
        state.score++
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

    function getDifficulty() {
        const max_lines = 50
        const difficulty_rate = Math.min(state.score / max_lines, 1)
        return FRAME_RATE + (HARD_FRAME_RATE - FRAME_RATE) * difficulty_rate
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
        getDifficulty,
    }
}

let startBtn = document.getElementById("start")
let canvas = document.getElementById("myCanvas")
let context = canvas.getContext('2d')

let game = createGame()
let gameLoop = null;

canvas.height = game.state.field.length * CELL_SIZE
canvas.width = (game.state.field[0].length + 4) * CELL_SIZE 
render(context, game)

function SetGameLoop() {
    
    if (!game.state.running) {
        clearTimeout(gameLoop)
        console.log("Game Over")
        return;
    }

    game.moveDown()
    game.update()
   
    render(context, game)
    gameLoop = setTimeout(SetGameLoop, game.getDifficulty())
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
    render(context, game)
})