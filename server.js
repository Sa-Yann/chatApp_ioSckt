const path = require ('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoined, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
// we the http module to allow io.socket to work properly
const server = http.createServer(app);
const io = socketio(server);

const botName = "Sayann Bot";

// Setting acces to the public static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connect
io.on('connection', socket => {
    // console.log("🚀 ~ file: server.js ~ line 20 ~ socket", socket)
    // console.log('Test New connection established');
    


    socket.on('join_room', ({username, room}) => {
        // we have the username and room infos from the Qs.parse(location.search) { } constants 
        // passed to the socket.emit on the client side 
        // console.log("🚀 ~ file: server.js ~ line 24 ~ socket.on ~ room", room); //answer room Javascript
        // io.emit('roomis_joined', `${username} has joined the room ${room}`)

        const user = userJoined(socket.id, username, room);

        // We want the user that has join to be able to acces the required room:
        socket.join(user.room);

        // send the message to the user connecting
        socket.emit('welcome_msg', formatMessage(botName, 'Welcome to SaYannChat App'));
        
        // // version 1:  broadcast when a user connects (brodcast to everybody except the sender)
        // socket.broadcast.emit('hasJoined_msg', formatMessage(botName, 'A user has joined the chat'));
        
        // version 2: broadcast to everyuser from a specific room except to the user
        socket.broadcast
            .to(user.room)
            .emit('message_sent', formatMessage(botName, `${user.username} has joined the chat!`));

        // We also use socket to help define the users connected in teh side bar of the chat
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        // console.log("🚀 ~ file: server.js ~ line 81 ~ io.to ~ users", users);
    });

    // Listen for Chat input message
    socket.on('chat_input_msg', message => {
    // console.log("🚀 ~ file: server.js ~ line 45 ~ message", message) //answe message typed ex: Hello Wyan
        
        const user = getCurrentUser(socket.id);
        // console.log("🚀 ~ file: server.js ~ line 53 ~ user", user);
        
        // console.log("🚀 ~ file: server.js ~ line 48 ~ socket.id", socket.id);
        // console.log("🚀 ~ file: server.js ~ line 48 ~ socket", socket); 
        
        io.to(user.room).emit('message_sent', formatMessage(user.username, message));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        // before idetifying user :io.emit(): brodcast to everybody
        // io.emit('disconnect_msg', formatMessage(botName, 'A user has left the chat'));

        // we want to identify the user when user leaves to let know the others users who has left the room
        const user = userLeave(socket.id)
        if(user) {
        // console.log("🚀 ~ file: server.js ~ line 68 ~ socket.on ~ socket.id", socket.id)
        // console.log("🚀 ~ file: server.js ~ line 68 ~ socket.on ~ socket", socket)
            io.to(user.room).emit('disconnect_msg', formatMessage(botName, `${user.username} has left the chat`));

            // we update the new list of users connected in teh side bar of the chat when a user is disconnecting
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
            // console.log("🚀 ~ file: server.js ~ line 83 ~ io.to ~ users", users);
        }

    });

});

const PORT = 3100 || process.env.port;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));