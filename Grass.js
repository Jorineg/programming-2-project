
// Grass starts with a random energy between 0 and 2.
// It gains 1 energy every frame.
// When it reaches 7 energy, it creates a new grass object
// in an empty neighbour cell and resets its energy to 0.

const Empty = require('./Empty.js');
const { findNeighbourPositions, matrix, random, state } = require('./gameState.js');

module.exports = class Grass {
    constructor() {
        this.stepCount = state.frameCount + 1;
        this.color = "green";

        // set initial energy to a random value between 0 and 2
        // to make grass grow look more natural
        this.energy = Math.floor(random(0, 3));
    }

    step() {
        // every step, grass gains 1 energy
        this.energy++;

        // if grass has 7 energy, multiply and reset energy
        if (this.energy >= 7) {
            this.multiply();
            this.energy = 0;
        }
    }

    multiply() {
        // look for empty neighbour cells
        let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);

        // if there is at least one empty cell,
        // choose a random one and create a new grass object
        if (emptyFields.length > 0) {
            let randomEmptyField = random(emptyFields);
            let row = randomEmptyField[0];
            let col = randomEmptyField[1];
            matrix[row][col] = new Grass();
        }
    }
}
