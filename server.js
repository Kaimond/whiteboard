const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://whiteboard-seven-jade.vercel.app"]
        methods: ['GET', 'POST'],
    },
});

// Store the current canvas state
let canvasHistory = [];

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send the current canvas state to other users
    socket.on("loadCanvas", () => {
        socket.emit("canvasState", { history: canvasHistory });
    });

    // Handle drawing actions
    socket.on("drawStroke", (stroke) => {
        if (!canvasHistory.some((s) => s.id === stroke.id)) {
            canvasHistory.push(stroke);
        }
        socket.broadcast.emit("drawStroke", stroke);
    });

    // Handle canvas clear
    socket.on('clearCanvas', () => {
        canvasHistory = [];
        socket.broadcast.emit('clearCanvas');
    });

    // Handle undo event
    socket.on("undo", (data) => {
        canvasHistory = canvasHistory.filter((stroke) => stroke.id !== data.stroke.id);
        socket.broadcast.emit("undo", data);
    });

    // Handle redo event
    socket.on('redo', (data) => {
        if (!canvasHistory.some((s) => s.id === data.stroke.id)) {
            canvasHistory.push(data.stroke);
        }
        socket.broadcast.emit("redo", data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
