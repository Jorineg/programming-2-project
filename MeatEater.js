// MeatEater looks for grass eater in its neighbour cells.
// If it finds grass eater, it moves to that cell, eats the grass eater and gains 10 energy.
// If it doesn't find grass eater, it loses 1 energy.
// If it has 120 energy, it creates a new meat eater object in an empty neighbour cell
// and loses 100 energy.
const Empty = require('./Empty.js');
const GrassEater = require('./GrassEater.js');
const { findNeighbourPositions, updateCreaturePosition, matrix, random, state } = require('./gameState.js');


module.exports = class MeatEater {
    constructor() {
        this.stepCount = state.frameCount + 1;
        this.color = "red";
        this.energy = 160;
    }

    eat() {
        let grassEaterFields = findNeighbourPositions(this.row, this.col, 2, GrassEater);
        if (grassEaterFields.length > 0) {
            let randomGrassEaterField = random(grassEaterFields);
            updateCreaturePosition(this, randomGrassEaterField);
            this.energy += 10;
        } else {
            this.energy--;
        }
    }

    multiply() {
        let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);
        if (emptyFields.length > 0) {
            let randomEmptyField = random(emptyFields);
            let row = randomEmptyField[0];
            let col = randomEmptyField[1];
            matrix[row][col] = new MeatEater();
        }
    }

    step() {
        this.eat()
        if (this.energy >= 200) {
            this.multiply();
            this.energy -= 160;
        } else if (this.energy <= 0) {
            matrix[this.row][this.col] = new Empty();
        }
    }
}