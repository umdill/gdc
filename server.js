const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the index.html file from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

let players = {};

io.on('connection', (socket) => {
    players[socket.id] = { 
        x: 100, 
        y: 300, 
        color: Math.floor(Math.random()*16777215) 
    };

    io.emit('currentPlayers', players);

    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            socket.broadcast.emit('playerMoved', { id: socket.id, x: movementData.x, y: movementData.y });
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(3000, () => console.log('started on localhost:3000'));