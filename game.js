const Grass = require('./Grass');
const GrassEater = require('./GrassEater');
const MeatEater = require('./MeatEater');
const Empty = require('./Empty');
const { matrix, random, matrixSize, state, nextFrame } = require('./gameState');

// display size in pixels of each cell
let blockSize = 15;

// What probability each creature has to be created
let creaturePropabilities = [
    [Grass, 0.25],
    [GrassEater, 0.05],
    [MeatEater, 0.005],
];

function spawn(creatutreType){
    for (let i=0; i<10; i++) {
        let row = Math.floor(Math.random() * matrix.length);
        let col = Math.floor(Math.random() * matrix[0].length);
        matrix[row][col] = new creatutreType();
    }
}

// Choose a random creature based on the probabilities
function getRandomCreature() {
    let rand = random();
    let sum = 0;
    for (let i = 0; i < creaturePropabilities.length; i++) {
        let creatureCLass = creaturePropabilities[i][0];
        let propability = creaturePropabilities[i][1];
        sum += propability;
        if (rand < sum) {
            return new creatureCLass();
        }
    }
    return new Empty();
}

// randomly fill the matrix with creatures based on the probabilities
function fillRandomMatrix() {
    for (let row = 0; row < matrixSize; row++) {
        matrix.push([]);
        for (let col = 0; col < matrixSize; col++) {
            matrix[row][col] = getRandomCreature();
        }
    }
}


// setup the canvas and fill the matrix with creatures
// Will be called once at the start
function setup() {
    // createCanvas(matrixSize * blockSize, matrixSize * blockSize);
    console.log("Empty", Empty)
    fillRandomMatrix();
    // noStroke();
    // frameRate(30);
}

// game loop. This will be called every frame
// It will draw the matrix and update the creatures
function draw() {
    // background(200)
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            let obj = matrix[row][col];

            // skip empty cells
            if (obj instanceof Empty) continue;

            // if (state.isSummer && Math.random() < 0.5) {
            //     obj.energy += 1;
            // }

            
            // set the row and col of the creature
            obj.row = row;
            obj.col = col;
            
            // this prevents newly created creatures from being updated in the same step
            // and creatures that move from being updated multiple times in one frame
            if (obj.stepCount === state.frameCount) {
                obj.stepCount++;
                if (!state.isSummer && Math.random() < 0.66) continue;
                obj.step();
            }

            // // draw the creature
            // fill(obj.color);
            // rect(blockSize * obj.col, blockSize * obj.row, blockSize, blockSize);
        }
    }

    if (state.frameCount % 100 === 0) {
        state.isSummer = !state.isSummer;
    }
    state.frameCount++;
}

module.exports = {
    setup,
    draw,
    spawn,
}