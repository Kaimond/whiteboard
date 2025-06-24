const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Store the current canvas state
let canvasState = null;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send the current canvas state to other users
    if (canvasState) {
        socket.emit('initCanvas', canvasState);
    }

    // Handle drawing actions
    socket.on('draw', (data) => {
        // Broadcast drawing action to all other clients
        socket.broadcast.emit('draw', data);
    });

    // Handle canvas clear
    socket.on('clearCanvas', () => {
        canvasState = null; // Reset canvas state
        socket.broadcast.emit('clearCanvas');
    });

    // Handle canvas state update
    socket.on('updateCanvasState', (dataUrl) => {
        canvasState = dataUrl; // Update server canvas state
        socket.broadcast.emit('updateCanvasState', dataUrl);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});