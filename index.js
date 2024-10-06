const express = require('express');
const app = express();
const path = require('path');
const port = 3030;

// Basic setup of socket io
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// view engine setup 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//public or assets setup 
app.use(express.static("public"));
app.set("public", path.join(__dirname, "public"));

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("recieve-location", { id: socket.id, ...data });
    });
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    })
})

app.get('/', (req, res) => {
    res.render("index.ejs")
});

server.listen(3030);