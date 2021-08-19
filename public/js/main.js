const chatForm = document.getElementById('chat-form');
const allMsgContainerDiv = document.querySelector('.chatMsgsContainer');


// io() is accessible cause of teh script we added in chat.html
const socket = io();

// Message from server
socket.on('message_sent', message => {
    console.log(message);
    outputMessage(message);

    // ScrollDown to alway make the last message visib;e:
    allMsgContainerDiv.scrollTop = allMsgContainerDiv.scrollHeight;
});

socket.on('welcome_msg', message => {
    console.log(message);
});

socket.on('hasJoined_msg', message => {
    console.log(message);
});

socket.on('disconnect_msg', message => {
    console.log(message);
});

// Message submit to server
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msgChatInputField = e.target.elements.msgId.value;

    // console.log(msgChatInputField);
    // Emit the message to the server
    socket.emit('chat_input_msg', msgChatInputField);

    e.target.elements.msgId.value = '';
    e.target.elements.msgId.focus();
});

// Output message to Dom
function outputMessage(message) {
        const div = document.createElement('div');
        div.classList.add('msgSent');
        div.innerHTML = `<p class="text">${message}</p>`
        document.querySelector('.chatMsgsContainer').appendChild(div);
};