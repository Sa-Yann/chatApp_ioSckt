const users = [];

// Join user to chat: add a user to an array and returns it
function userJoined(id,username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
};

// Get curent user by his id
function getCurrentUser(id) {
    return users.find(user => user.id === id);
};

// user leaves Chat Room
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    console.log("🚀 ~ file: users.js ~ line 20 ~ userLeave ~ index", index);
    // finfIndex return -1 if he doesn't find a user.id === id
    if(index !== -1){
        //  we wonna add the user in const users = []
        return users.splice(index, 1)[0];
    };
};

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
};

module.exports={
    userJoined,
    getCurrentUser,
    userLeave,
    getRoomUsers
};