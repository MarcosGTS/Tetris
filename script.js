



const CELL_SIZE = 50


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
        field :[
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],],

    }

    let pieces = {
        "s":[["red","red", ""],
             ["", "red","red"],
             ["", "", ""]],
        "l":[["blue","", ""],
             ["blue", "",""],
             ["blue", "blue", ""]],
    }

    let crrPiece = {
        "piece": null,
        "x": 0,
        "y": 2,
    }

    crrPiece.piece = pieces.s;

    function placePieceOnField() {
        clearField()
        
        for (let row in crrPiece.piece) {
            for (let col in crrPiece.piece[0]) {
                let fieldX = crrPiece.x + parseInt(col)
                let fieldY = crrPiece.y + parseInt(row)
                
                state.field[fieldY][fieldX] = crrPiece.piece[row][col]
                
            }
        }
    }

    function clearField() {
        state.field = [
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
        ]
    }

    function update() {
        placePieceOnField()
    }

    return {
        state,
        update
    }
}

let canvas = document.getElementById("myCanvas")
let context = canvas.getContext('2d')
let game = createGame()

canvas.height = game.state.field.length * CELL_SIZE
canvas.width = game.state.field[0].length * CELL_SIZE

game.update()
console.log(game.state.field)
render(context, game.state.field)