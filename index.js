const express = require('express');
const app = express();
const path = require('path');
var server = require('http').createServer(app);
const io = require('socket.io')(server);
var port = process.env.PORT || 3000;

// setting path for public directory
app.use(express.static(path.join(__dirname, 'public')));
const users = {}
// handing socket connection
io.on('connection', socket => {

    // handling new-user event
    socket.on('new-user', name => {
        // storing user data in an object
        users[socket.id] = name;

        // emitting response to same socket i.e same user when a user joined
        socket.emit('user-joined', {
            message: `You joined as: ${name}`,
            totalUsers: Object.keys(users).length,
            users: users
        })
        // broadcasting event to all connected sockets i.e users that a new user has joined
        socket.broadcast.emit('user-connected', {
            message: `${name} connected`,
            totalUsers: Object.keys(users).length,
            users: users
        })
    })
    // handling event when a message is sent
    socket.on('send-message', message => {
        // sending all connected users the message sent by a user
        socket.broadcast.emit('message', {
            name: users[socket.id],
            message: message
        })
    })

    socket.on('disconnect', () => {
        name = users[socket.id]
        // removing user on socket disconnection
        delete users[socket.id]
        // informing all connected users that a user has disconnected
        socket.broadcast.emit('user-disconnected', {
            message: `${name} diconnected`,
            totalUsers: Object.keys(users).length,
            users: users
        })
    })
});

// starting express server
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});