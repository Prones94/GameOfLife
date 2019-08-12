var grid;
let fr = 5;
// gridSize = 30;
function setup() {
    createCanvas(400, 400);
    grid = new Grid(5);
    grid.randomize()

}
function draw() {
    background(250);

    grid.updateNeighborCount();
    grid.updatePopulation();
    grid.draw();
    frameRate(fr);
}
 function mousePressed() {
    var randomColumn = floor(random(grid.numberOfColumns));
    var randomRow = floor(random(grid.numberOfRows));
    
    var randomCell = grid.cells[randomColumn][randomRow];
    var neighborCount = grid.getNeighbors(randomCell).length;

    // print("cell at " + randomCell.column + ", " + randomCell.row + " has " + neighborCount + " neighbors");
    // print(grid.isValidPosition(0, 0));
    // print(grid.isValidPosition(-1, -1))
    // print(grid.cells);

    if(mousePressed === true){
        noLoop();
    } else {

    }
}
class Grid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.numberOfColumns = height / cellSize;
        this.numberOfRows = width / cellSize;
        this.cells = new Array(this.numberOfRows);

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Array(this.numberOfColumns);
        }

        for (var column = 0; column < this.numberOfColumns; column++) {
            for (var row = 0; row < this.numberOfRows; row++) {
                this.cells[column][row] = new Cell(column, row, cellSize)
            }
        }

        print(this.cells)
    }
    draw() {
        for (var column = 0; column < this.numberOfColumns; column++) {
            for (var row = 0; row < this.numberOfRows; row++) {
                this.cells[column][row].draw()
            }
        }
    }
    randomize() {
        for (var column = 0; column < this.numberOfColumns; column++) {
            for (var row = 0; row < this.numberOfRows; row++) {
                this.cells[column][row].setIsAlive(floor(random(2)));
            }
        }
    }
    getNeighbors(currentCell) {
        var neighbors = [];
        for (var xOffset = -1; xOffset <= 1; xOffset++) {
            for (var yOffset = -1; yOffset <= 1; yOffset++) {
                var neighborColumn = currentCell.column + xOffset;
                var neighborRow = currentCell.row + yOffset;
                //neighbors.push(this.cells[neighborColumn][neighborRow])
                if (this.isValidPosition(neighborColumn, neighborRow)) {
                    var neighborCell = this.cells[neighborColumn][neighborRow]
                    if (this.cells[currentCell.column][currentCell.row] !== neighborCell) {
                        neighbors.push(neighborCell);
                    }
                }
            }
        }
        return neighbors;
    }
    updatePopulation() {
        for (var column = 0; column < this.numberOfColumns; column++) {
            for (var row = 0; row < this.numberOfRows; row++) {
                this.cells[column][row].liveOrDie();
            }
        }
    }
    isValidPosition(column, row) {
        if (column < this.numberOfColumns && column >= 0 && row < this.numberOfRows && row >= 0) {
            return true;
        } else {
            return false;
        }
    }
    updateNeighborCount() {
        for (var column = 0; column < this.numberOfColumns; column++) {
            for (var row = 0; row < this.numberOfRows; row++) {
                var allCells = this.cells[row][column];
                allCells.liveNeighborCount = 0;
                var allLiveNeighbors = this.getNeighbors(allCells);
                for (var i = 0; i < allLiveNeighbors.length; i++){
                    if (allLiveNeighbors[i].isAlive === true) {
                        allCells.liveNeighborCount += 1;
                    }
                }
            }
            // print(this.liveNeighborCount)
        }
    }
}

class Cell {
    constructor(column, row, size, liveNeighborCount) {
        this.row = row;
        this.column = column;
        this.size = size;
        this.isAlive = false;
        this.liveNeighborCount = 0;
    }
    draw() {
        if (this.isAlive) {
            fill("orange")
        } else {
            fill(("black"))
        }
        noStroke();
        rect(this.column * this.size + 1, this.row * this.size + 1, this.size - 1, this.size - 1);
    }
    setIsAlive(value) {
        if (value) {
            this.isAlive = true
        } else {
            this.isAlive = false
        }
    }
    liveOrDie() {
        if (this.isAlive && this.liveNeighborCount < 2) {
            this.isAlive = false;
        } else if (this.isAlive && this.liveNeighborCount <= 3 && this.liveNeighborCount >= 2) {
            this.isAlive = true;
        } else if (this.isAlive && this.liveNeighborCount > 3) {
            this.isAlive = false;
        } else if (!this.isAlive && this.liveNeighborCount === 3) {
            this.isAlive = true;
        }
    }
}