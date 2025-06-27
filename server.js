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


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle drawing actions
    socket.on("drawStroke", (stroke) => {
        socket.broadcast.emit("drawStroke", stroke);
    });

    // Handle canvas clear
    socket.on('clearCanvas', () => {
        socket.broadcast.emit('clearCanvas');
    });
    // Handle canvas state update
    socket.on('updateCanvasState', (dataUrl) => {
        canvasState = dataUrl; // Update server canvas state
        socket.broadcast.emit('updateCanvasState', dataUrl);
    });

    // Handle undo event
    socket.on("undo", (data) => {
        socket.broadcast.emit("undo", data);
    });

    // Handle redo event
    socket.on('redo', (data) => {
        socket.broadcast.emit("redo", data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});