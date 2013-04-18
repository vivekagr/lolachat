var http = require('http');
var express = require('express');
var socket = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.use('/', express.static(__dirname));

io.sockets.on('connection', function(client) {
    client.on('join', function(name) {
        client.set('nick', name);
        client.broadcast.emit('newUser', name);
        console.log('New user connected: ' + name);
    });

    client.on('message', function(message) {
        client.get('nick', function(error, name) {
            client.emit('messages', name + ": " + message);
            client.broadcast.emit('messages', name + ": " + message);
        });
    });

    client.on('disconnect', function(name) {
        client.get('nick', function(error, name) {
            client.broadcast.emit('removeUser', name);
        });
    });
});

port = process.env.PORT || 8000;
server.listen(port);