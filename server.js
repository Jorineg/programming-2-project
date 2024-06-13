// import von der setup und draw Funktion und der matrix Variable
// ...
const Grass = require('./Grass');
const GrassEater = require('./GrassEater');
const MeatEater = require('./MeatEater');
const Empty = require('./Empty');

const { setup, draw, spawn } = require('./game.js');
const { matrix, state } = require('./gameState.js');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// wir speichern das Ergebnis von der setInterval Funktion in einer Variable,
// damit wir es später stoppen können
let intetval;

// wir sagen Express, dass die Dateien im Ordner client statisch sind
// das bedeutet, dass sie direkt an der Browser geschickt werden können
// Der Code für den Client muss also im Ordner client liegen
app.use(express.static('client'));

// wenn ein Benutzer die Seite öffnet, wird er auf die index.html Datei weitergeleitet
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// wir starten den Server auf dem Port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// wenn ein Benutzer eine Verbindung zum Server herstellt, wird diese Funktion ausgeführt
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');

        // wir stoppen das Spiel, wenn der Benutzer die Verbindung trennt
        clearInterval(intetval);
    });

    setup();
    intetval = setInterval(() => {
        draw();
        socket.emit('data', { matrix: transformMatrix(matrix), isSummer: state.isSummer });
    }, 30);

    socket.on('spawnGrass', (data) => {
        spawn(Grass);
    });
    socket.on('spawnGrassEater', (data) => {
        spawn(GrassEater);
    });
    socket.on('spawnPredator', (data) => {
        spawn(MeatEater);
    });
    socket.on("lightning", () => {
        console.log("lightning");
        let centerRow = Math.floor(Math.random() * matrix.length);
        let centerCol = Math.floor(Math.random() * matrix[0].length);
        let maxDistance = 7;
        for(let distance=0; distance<6; distance++) {
            setTimeout(() => {
                for(let nRow=centerRow-maxDistance; nRow<=centerRow+maxDistance; nRow++) {
                    for(let nCol=centerCol-maxDistance; nCol<=centerCol+maxDistance; nCol++) {
                        let actualDistance = Math.sqrt((nRow-centerRow)**2 + (nCol-centerCol)**2);
                        if(actualDistance >= distance) continue;
                        if(nRow >= 0 && nRow < matrix.length && nCol >= 0 && nCol < matrix[0].length) {
                            matrix[nRow][nCol] = new Empty();
                        }
                    }
                }
            }, distance * 30);
        }
    });

    socket.on("rain", () => {
        console.log("rain");
        state.isSummer = !state.isSummer;
    });

});




// Diese Funktion sorgt dafür, dass die Matrix nur noch Strings mit Farben enthält
function transformMatrix(matrix) {
    // Wenn ihr Zahlen in der Matrix habt, können sie hier in Farben umgewandelt werden
    // ...
    return matrix.map(row => row.map(cell => cell.color || 'white'));
}