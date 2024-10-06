const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 4000;

// Basic setup of socket io
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// View engine setup 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Public or assets setup 
app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("send-location", (data) => {
        console.log("Location received from user", socket.id, data); // Debugging
        io.emit("receive-location", { id: socket.id, ...data });
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit("user-disconnected", socket.id);
    });
});

app.get('/', (req, res) => {
    res.render("index");
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
