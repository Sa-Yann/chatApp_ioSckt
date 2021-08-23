const chatForm = document.getElementById('chat-form');
const allMsgContainerDiv = document.querySelector('.chatMsgsContainer');
const roomName = document.getElementById('room__Name');
const userList =  document.getElementById('users__Name');


// Get username and room name
const { username, room } = Qs.parse(location.search, {
    // url value comes from DOM: window.location.search
    ignoreQueryPrefix: true,
});

// console.log(username,room);

// io() is accessible cause of teh script we added in chat.html
const socket = io();
// console.log("🚀 ~ file: main.js ~ line 15 ~ socket", socket);


// User Joining Room / Sending const : room and username to teh server side 
socket.emit('join_room', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsersNameList(users);
})

// Message from server
socket.on('message_sent', message => {
    // console.log(message);
    outputMessage(message);

    // ScrollDown to alway make the last message visib;e:
    allMsgContainerDiv.scrollTop = allMsgContainerDiv.scrollHeight;
});

socket.on('welcome_msg', message => {
    // console.log(message);
    outputMessage(message);
});

socket.on('hasJoined_msg', message => {
    // console.log(message);
    outputMessage(message);

    // ScrollDown to alway make the last message visib;e:
    allMsgContainerDiv.scrollTop = allMsgContainerDiv.scrollHeight;
});

socket.on('disconnect_msg', message => {
    // console.log(message);
    outputMessage(message);
    allMsgContainerDiv.scrollTop = allMsgContainerDiv.scrollHeight;
});

// Message submit to server
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // msgChatInputField récupere la valeur taper dans l input field dont l'id est msgId
    const msgChatInputField = e.target.elements.msgId.value;

    // console.log(msgChatInputField);
    // Emit the message to the server
    socket.emit('chat_input_msg', msgChatInputField);

    // empty the input field after sending msg
    e.target.elements.msgId.value = '';
    //  place cursor back to the start of the input field
    e.target.elements.msgId.focus();
});

// Output message to Dom
function outputMessage(message) {
        const div = document.createElement('div');
        div.classList.add('msgSent');
        div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`
        document.querySelector('.chatMsgsContainer').appendChild(div);
};

// Add room name to DOm
function outputRoomName(room){
    roomName.innerText = `${room}`;
};

// Add users to Dom
function outputUsersNameList(users) {
    userList.innerHTML = `
        ${users.map( user => `<li>${user.username}</li>`).join('')}  
    `
}; //join() returns an array as a string'