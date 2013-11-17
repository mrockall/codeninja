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
    gameSocket.on('host:create_game', hostCreateNewGame);
    gameSocket.on('host:start_countdown', hostStartCountdown);

    // Player Events
    gameSocket.on('player:join_game', playerJoinGame);
    gameSocket.on('player:answer', playerAnswer)

    // Game Events
    gameSocket.on('game:get_round', getRoundData)
    gameSocket.on('game:over', gameOver)
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

/*
 * Two players have joined. Alert the host!
 * @param gameId The game ID / room ID
 */
function hostStartCountdown(gameId) {
    var sock = this;
    var data = {
        mySocketId : sock.id,
        gameId : gameId
    };
    
    console.log("All Players Present. Preparing game...");
    io.sockets.in(data.gameId).emit('game:start_countdown', data);
}

function hostStartGame(gameId) {
    console.log('Game Started.');
    sendRoundData(gameId, 1);
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

function playerAnswer(data) {
    console.log('Player ID: ' + data.playerId + ' answered with: ' + data.answer);

    // The player's answer is attached to the data object.
    // Emit an event with the answer so it can be checked by the 'Host'
    io.sockets.in(data.gameId).emit('host:check_answer', data);
}

/* *****************************
   *                           *
   *      GAME FUNCTIONS       *
   *                           *
   ***************************** */

/**
 * The "game:get_round" event occurred.
 *
 * A game has requested some round data. We will return a random team
 * and three other decoy teams.
 * @return data {Object} {
 *     playerName: {string}, // The player's name .
 *     gameId: {integer},    // The game the player is trying to join.
 * }
 */
function getRoundData(game_id) {
    var league = teams;
    league = shuffle(league);
    team = league[0];

    decoys = league.slice(0,4);
    decoys = shuffle(decoys);

    // Set up the data object
    var data = {
        team: team,
        answers : decoys
    };

    io.sockets.in(game_id).emit('game:new_round_data', data);
}

/*
 * Javascript implementation of Fisher-Yates shuffle algorithm
 * http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
 */
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/**
 * The 'game:over' event has occured.
 *
 * Lets send the update to everyone involved in this game.
 * @param  {Int} game_id The ID of Game.
 */
function gameOver(game_id) {
    console.log('Game Over! #' + game_id);
    io.sockets.in(game_id).emit('game:over');
}

var teams = [
    "Arsenal", "Aston Villa", "Cardiff City", "Chelsea", "Crystal Palace", "Everton", "Fulham",
    "Hull City", "Liverpool", "Man City", "Man Utd", "Newcastle Utd", "Norwich", "Southampton",
    "Stoke City", "Sunderland", "Swansea City", "Tottenham Hotspur", "West Brom", "West Ham Utd"
];