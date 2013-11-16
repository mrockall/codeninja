/**
 * game.js
 *
 * This file listens to and reacts to any event that is emitted by the browser.
 * 
 * List of Host Events:
 *   - host:create_game   Creates a new room and returns the ID to the browser.
 *
 * List of Player Events:
 *   - player:join_game   Joins a player to a game ID
 */


var io,
    gameSocket;

/**
 * This function is called by index.js to initialise a new game instance.
 * 
 * Every browser that connect to the game will call this initialise function. It
 * listens for all the events sent by the browser and calls the appropriate game
 * function on this side.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('host:create_game', hostCreateNewGame); // hostCreateNewGame

    // Player Events
    gameSocket.on('player:join_game', playerJoinGame);
}

/* *****************************
   *                           *
   *       HOST FUNCTIONS      *
   *                           *
   ***************************** */


/**
 * The 'hostCreateNewGame' event occurred.
 * 
 * Create a new room and join it. Return the game/room id to the
 * browser so they can distribute it.
 */
function hostCreateNewGame() {

    // Create a unique Socket.IO Room
    var this_game_id = ( Math.random() * 100000 ) | 0;

    // Join the Room and wait for the players
    this.join(this_game_id.toString());

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('host:new_game_created', {game_id: this_game_id, my_socket_id: this.id});

    console.log("=== Host, Socket " + this.id + " has created game #" + this_game_id);

};


/* *****************************
   *                           *
   *     PLAYER FUNCTIONS      *
   *                           *
   ***************************** */

/**
 * The "player:join_game" event occurred.
 *
 * A player has tried to join a game.
 * @param data {Object} {
 *     playerName: {string}, // The player's name .
 *     gameId: {integer},    // The game the player is trying to join.
 * }
 */
function playerJoinGame(data) {
    console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId );

    // A reference to the player's Socket.IO socket object
    var sock = this;

    // Look up the room ID in the Socket.IO manager object.
    var room = gameSocket.manager.rooms["/" + data.gameId];

    // If the room exists...
    if( room != undefined ){

        console.log('Player ' + data.playerName + ' joining game: ' + data.gameId );

        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.gameId);

        // Emit an join success event!
        this.emit('player:join_success', {room: room});

        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.gameId).emit('player:joined_room', data);

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{message: "This room does not exist."} );
    }
}