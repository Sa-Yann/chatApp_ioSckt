const path = require ('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatmessage = require('./utils/messages')

const app = express();
// we the http module to allow io.socket to work properly
const server = http.createServer(app);
const io = socketio(server);

// Setting acces to the public static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connect
io.on('connection', socket => {
    // console.log('Test New connection established');

    // send the message to the user connecting
    socket.emit('welcome_msg', 'Welcome to SaYannChat App');

    // broadcast when a user connects (brodcast to everybody except the sender)
    socket.broadcast.emit('hasJoined_msg', 'A user has joined the chat');

    // Runs when client disconnects
    socket.on('disconnect', () => {
        // io.emit(): brodcast to everybody
        io.emit('disconnect_msg', 'A user has left the chat');
    });

    // Listen for Chat input message
    socket.on('chat_input_msg', message => {
        console.log(message);
        io.emit('message_sent', message);
    });
});

const PORT = 3100 || process.env.port;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));