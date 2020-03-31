const socket = io(BASE_URL);

// prompt for user name
let name = prompt('What is your name?');

// if name is not given by user then assign random name to user
if (name == null || name == "") {
    name = `User ${Math.round(Math.random() * 10)}`
}

// emit event that new user has connected
socket.emit('new-user', name);

// handle event that user has joined and updating required html and fields
socket.on('user-joined', data => {
    showMessage(data.message)
    $("#total-users").text(data.totalUsers)
    showOnlineUsers(data.users, data.totalUsers)
});

//adding user name in front of every user message
socket.on('message', data => {
    showMessage(`<span class="text-primary">${data.name}</span>: ${data.message}`)
});

// showing message that user has connected and updating total number of users
socket.on('user-connected', data => {
    showMessage(data.message)
    $("#total-users").text(data.totalUsers)
    showOnlineUsers(data.users, data.totalUsers)
});

// showing message that user has disconnected and updating total number of users
socket.on('user-disconnected', data => {
    showMessage(data.message)
    $("#total-users").text(data.totalUsers)
    showOnlineUsers(data.users, data.totalUsers)
});

// handling input message, emitting event that user has added a message
$("form").submit((event) => {
    event.preventDefault();
    const message = $("#message").val()
    if (message == "") return
    showMessage(`<span class="text-success">You</span>: ${message}`)
    socket.emit('send-message', message)
    $("#message").val('');
});

// showing all message in a text box
function showMessage(message) {
    $('#message-container').append("<p>" + message + "</p>")
    $('#message-container').scrollTop($('#message-container')[0].scrollHeight);
}

function showOnlineUsers(users, totalUsers) {
    onlineUserHtml = ""
    if (totalUsers) {
        for (let id in users) {
            onlineUserHtml += `<p>${users[id]}</p>`
        }
    } else {
        onlineUserHtml = "No user online"
    }
    $("#online-users").html(onlineUserHtml)
}