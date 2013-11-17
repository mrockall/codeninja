// Set up some references
var app = app || {};
if(_.isUndefined(app.Models)) app.Models = {};

/**
 * Game Model
 * This model holds all of our logic for our game.
 * This model is also our interaction point for our websocket.
 */
app.Models.Game = Backbone.Model.extend({
  defaults: {
    socket_id: 0,
    role: ''
  },

  /**
   * Init this model.
   * Define some events to listen to from the server.
   * @return {Object} A reference to itself
   */
  initialize: function() {
    _.bindAll(this, 'onConnected', 'onNewGameCreated', 'playerJoinedRoom');
    
    io.socket.on('connected', this.onConnected );
    io.socket.on('host:new_game_created', this.onNewGameCreated );
    io.socket.on('player:joined_room', this.playerJoinedRoom );

    return this;
  },

  /**
   * Event Hander 'connected'
   * We have successfully opened a websocket connection
   * Lets store the socket id
   */
  onConnected: function() {
    this.set('socket_id', io.socket.socket.sessionid);
    console.log("== Successfully opened a socket connection, my_socket_id = " + this.get('socket_id'));
  },

  /**
   * Event Handler 'host:new_game_created'
   * We have created a new game, need to set our role as a host
   * and store the ID of the game.
   * @param  {Object} data Object containing the game ID
   */
  onNewGameCreated: function(data) {
    console.log("== Game created", data);

    this.set('role', "Host");
    this.set('game_id', data.game_id);

    this.Players = new app.Collections.Players();

    game.trigger("game:created");
  },

  /**
   * Event Handler 'player:joined_room'
   * A player has joined the room, lets add him to the collection
   * @param  {Object} data Object containing data about the player
   */
  playerJoinedRoom: function(data) {
    console.log("== Player Joined", data);

    if(this.get('role') == "Host" && data.gameId == this.get('game_id')){
      this.Players.add({
        name: data.playerName,
        socket: data.mySocketId
      });
    } else {
      app.Router.navigate('waiting', {trigger: true});
    }
  }
});