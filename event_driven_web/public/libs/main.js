/**
 * Create a game object to hold all of our logic...
 */
var game = {

    /**
     * The session ID for this socket connection.
     * @type {String}
     */
    my_socket_id: 0,

    /**
     * Do some stuff to initialise our game.
     * Connect our WebSocket and bind some events in the UI.
     */
    init: function() {
        io.socket = io.connect();
        game.bindEvents();
    },

    /**
     * While connected, Socket.IO will listen to the following events emitted
     * by the Socket.IO server, then run the appropriate function.
     * Also bind some click events using JQuery.
     */
    bindEvents : function() {
        $(".js_create_game").click(game.createGame);
        $(".js_show_join_form").click(game.showJoinForm);
        $(".js_join_game").click(game.joinGame);

        io.socket.on('connected', game.onConnected );
        io.socket.on('host:new_game_created', game.onNewGameCreated );
        io.socket.on('player:joined_room', game.playerJoinedRoom );
        io.socket.on('player:join_success', game.onJoinSuccess )
        io.socket.on('error', game.thereWasAnError );
    },

    /**
     * Click handler for creating a game.
     * @param  {Event}  ev  Jquery Event object
     */
    createGame: function(ev) {
        ev.preventDefault();
        io.socket.emit("host:create_game");
    },

    /**
     * Click handler for joining a game.
     * @param  {Event}  ev  Jquery Event object
     */
    showJoinForm: function(ev) {
        ev.preventDefault();
        $(".join_form").slideDown();
    },

    /**
     * Click handler for joining a game.
     * @param  {Event}  ev  Jquery Event object
     */
    joinGame: function(ev) {
        ev.preventDefault();

        var player_data = {
            playerName: $(".js_name").val(),
            gameId: $(".js_game_id").val()
        }
        io.socket.emit("player:join_game", player_data);
    },

    /**
     * The client is successfully connected!
     */
    onConnected : function() {
        // Cache a copy of the client's socket.IO session ID
        game.my_socket_id = io.socket.socket.sessionid;
        console.log("== Successfully opened a socket connection, my_socket_id = " + game.my_socket_id);
    },

    /**
     * Callback when a game has successfully been created.
     */
    onNewGameCreated: function(data) {
        console.log("== Game created", data);
        $(".game_details").text("We are now hosting game ID " + data.game_id);
    },

    /**
     * Callback once you have successfully joined a game.
     */
    onJoinSuccess: function(data) {
        console.log("== Join successful", data);
    },

    /**
     * Callback when a player joins the game you host, or that you are in.
     */
    playerJoinedRoom: function(data) {
        console.log("== Player Joined", data);
        var $player = $("<li></li>").text(data.playerName + " has joined the game.");
        $(".players").append($player);
    },

    /**
     * There was an error!
     */
    thereWasAnError: function(data) {
        console.log("== ERROR!!!", data);
    }
}

$(document).ready(function(){
    game.init();
});