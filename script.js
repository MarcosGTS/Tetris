
let field = [
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","red","red","",""],
    ["","","","red","red",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
]

const CELL_SIZE = 50


function render(context, field) {
    for(let row in field) {
        for (let col in field[0]) {
            context.fillStyle = field[row][col] || "white"
            context.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
    }
}

let canvas = document.getElementById("myCanvas")
let context = canvas.getContext('2d')

canvas.height = field.length * CELL_SIZE
canvas.width = field[0].length * CELL_SIZE

render(context, field)