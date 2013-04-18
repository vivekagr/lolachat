var http = require('http');
var express = require('express');
var socket = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server);

// need this configuration for heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

// serve the static sons and daughters
app.use('/', express.static(__dirname));

// when a client's browser connect
io.sockets.on('connection', function(client) {
    // when user joins by sending his nickname
    client.on('join', function(name) {
        client.set('nick', name);
        client.broadcast.emit('newUser', name);
        console.log('New user connected: ' + name);
    });

    // when client sends a chat message
    client.on('message', function(message) {
        client.get('nick', function(error, name) {
            client.emit('messages', name + ": " + message);
            client.broadcast.emit('messages', name + ": " + message);
        });
    });

    // when client disconnects :(
    client.on('disconnect', function(name) {
        client.get('nick', function(error, name) {
            client.broadcast.emit('removeUser', name);
        });
    });
});

// get the relevant port from herko or use 8000
port = process.env.PORT || 8000;
server.listen(port);