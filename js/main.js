var socket = io.connect('http://localhost');
var chatMessage, messageEl;

socket.on('connect', function() {
    $('.status').text('Status: Connected');
    var nick = prompt("Enter your nickname");
    if (!!nick) {
        socket.emit('join', nick);
        addUser(nick);
    }
});

socket.on('disconnect', function() {
    $('.status').text('Status: Disconnected');
});

socket.on('newUser', function(name) {
    console.log('user connected: ' + name);
    addUser(name);
});

socket.on('messages', function(message) {
    addMessage(message);
});

$("#chat-form").submit(function(){
    chatMessage = $('#textbox').val();
    if (!!chatMessage) {
        $('#textbox').val('');
        socket.emit('message', chatMessage);
    }
    return false;
});


function addUser(name) {
    $(".user-list").append($('<li id="'+name+'">'+name+'</li>'));
}

function removeUser(name) {
    $("#"+name).remove();
}

function addMessage(message) {
    messageEl = $("ul.message-list");
    messageEl.append($('<li>'+message+'</li>'));
    messageEl.scrollTop(messageEl.height());
}