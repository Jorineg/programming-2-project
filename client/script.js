// Socket.io: Verbindung zum Server herstellen
// Die socket Variable enthält eine Verbindung zum Server.
const socket = io();
const cellSize = 16;

let objectMap = {
    "white": "Empty",
    "green": "Grass",
    "f5c002": "GrassEater (m)",
    "#c8f502": "GrassEater (f)",
    "red": "MeatEater"
}

const data = {
    labels: ['Empty', 'Grass', 'GrassEater', 'MeatEater'],
    datasets: [{
        data: [10, 20, 30, 40],
        backgroundColor: ['#aaaaaa', '#33cc33', '#eeff00', '#ff3333']
    }]
};

// Config
const config = {
    type: 'pie',
    data: data
};

let pieChart;

// setup Funktion von p5.js
function setup() {
    createCanvas(windowWidth - 200, windowHeight);
    noStroke();
    // Create chart
    pieChart = new Chart(document.getElementById('myPieChart'), config);
}

// Mit socket.on() können wir auf Ereignisse vom Server reagieren.
// Hier reagieren wir auf das Ereignis matrix, das uns die aktuelle Matrix vom Server sendet.
socket.on('data', (data) => {

    let matrix = data.matrix;
    let isSummer = data.isSummer;

    console.log("isSummer", isSummer);
    // Die Matrix wird auf den Bildschirm gezeichnet.
    let counts = {
        "Empty": 0,
        "Grass": 0,
        "GrassEater (m)": 0,
        "GrassEater (f)": 0,
        "MeatEater": 0
    };
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let color = matrix[i][j];
            if (!isSummer && color == "green") {
                color = "darkgreen";
            }
            fill(color);
            rect(j * cellSize, i * cellSize, cellSize, cellSize);
            counts[objectMap[matrix[i][j]]]++;
        }
    }
    console.log(counts);
    pieChart.data.datasets[0].data = [counts["Empty"], counts["Grass"], counts["GrassEater (m)"] + counts["GrassEater (f)"], counts["MeatEater"]];
    // pieChart.data.datasets[0].data = [15, 10, 25, 40];
    pieChart.update();
});

function spawnGrass() {
    socket.emit('spawnGrass');
}
function spawnGrassEater() {
    socket.emit('spawnGrassEater');
}
function spawnPredator() {
    socket.emit('spawnPredator');
}
function lightning() {
    socket.emit('lightning');
}
function rain() {
    socket.emit('rain');
}





// wir können hier auch auf andere Ereignisse reagieren, die der Server sendet
// socket.on('someEvent', (data) => {