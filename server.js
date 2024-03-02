const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint to show chat
app.get('/chart', (req, res) => {
    res.sendFile(__dirname + '/chart.html');
});

// spinner
app.get('/spin', (req, res) => {
    res.sendFile(__dirname + '/spinner.html');
});

// collatz-sequence
app.get('/collatz-sequence', (req, res) => {
    res.sendFile(__dirname + '/collatz.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');
    // Simulate sensor data and emit it to clients every second
    setInterval(() => {
        const data = Math.random() * 100; // Simulated sensor data
        socket.emit('sensorData', data);
    }, 1000);

    // spinner
    socket.on('spin', () => {
        const result = Math.floor(Math.random() * 100) + 1;
        socket.emit('spinResult', result);
    });

    // collatz-sequence
    socket.on('generateSequence', (inputValue) => {
        const sequence = generateCollatzSequence(parseInt(inputValue));
        io.emit('sequenceData', sequence);
    });
});

function generateCollatzSequence(n) {
    const sequence = [n];
    while (n > 1) {
        if (n % 2 === 0) {
            n /= 2;
        } else {
            n = 3 * n + 1;
        }
        sequence.push(n);
    }
    return sequence;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
