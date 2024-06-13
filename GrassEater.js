
// GrassEater looks for grass in its neighbour cells.
// If it finds grass, it moves to that cell, eats the grass and gains 1 energy.
// If it doesn't find grass, it moves to a random empty neighbour cell and loses 1 energy.
// If it has 10 energy, it creates a new grass eater object in an empty neighbour cell
// and loses 5 energy.
// If it has 0 energy, it dies and becomes an empty cell.

const { findNeighbourPositions, updateCreaturePosition, matrix, random, state } = require('./gameState.js');;
const Empty = require('./Empty.js');
const Grass = require('./Grass.js');

module.exports = class GrassEater {
    constructor() {
        this.stepCount = state.frameCount + 1;
        this.energy = 5;
        this.isMale = random() < 0.5;
        this.color = this.isMale ? "#f5c002" : "#c8f502";
    }

    eat() {
        if (state.isWinter && Math.random() < 0.5) return;
        let grassFields = findNeighbourPositions(this.row, this.col, 1, Grass);
        if (grassFields.length > 0) {
            let randomGrassField = random(grassFields);
            updateCreaturePosition(this, randomGrassField);
            this.energy++;
        } else {
            let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);
            if (emptyFields.length > 0) {
                let randomEmptyField = random(emptyFields);
                updateCreaturePosition(this, randomEmptyField);
            }
            this.energy--;
        }
    }

    multiply() {
        let grassEaterFields = findNeighbourPositions(this.row, this.col, 2, GrassEater);
        let maleGrassEaterFields = grassEaterFields.filter(field => matrix[field[0]][field[1]].isMale);

        let freeFields = findNeighbourPositions(this.row, this.col, 1, Empty);
        if (freeFields.length > 0 && maleGrassEaterFields.length > 0) {
            let randomFreeField = random(freeFields);
            let row = randomFreeField[0];
            let col = randomFreeField[1];
            matrix[row][col] = new GrassEater();
        }
    }

    step() {
        this.eat();
        if (!this.isMale && this.energy >= 10) {
            this.multiply();
            this.energy -= 5;
        } else if (this.energy <= 0) {
            matrix[this.row][this.col] = new Empty();
        }
        if (this.energy > 10) {
            this.energy = 10;
        }
    }
}