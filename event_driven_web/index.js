// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();

// Import the Anagrammatix game file.
var game = require('./game');

// Create a simple Express application
app.configure(function() {
    // Turn down the logging activity
    app.use(express.logger('dev'));

    // Serve static html, js, css, and image files from the 'public' directory
    app.use(express.static(path.join(__dirname,'public')));

    app.use("/css",  express.static(__dirname + '/public/css'));
    app.use("/app",  express.static(__dirname + '/public/app'));
    app.use("/libs", express.static(__dirname + '/public/libs'));
});

// Route everything through index and let Backbone route them!
app.get('*', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});

// Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(8001);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
io.set('log level', 1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    game.initGame(io, socket);
});