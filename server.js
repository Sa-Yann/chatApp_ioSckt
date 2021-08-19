const path = require ('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')

const app = express();
// we the http module to allow io.socket to work properly
const server = http.createServer(app);
const io = socketio(server);

// Setting acces to the public static folder
app.use(express.static(path.join(__dirname, 'public')))

// Run when a client connect
io.on('connection', socket => {
    console.log('New connection established');
});

const PORT = 3100 || process.env.port;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));