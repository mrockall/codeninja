// Set up some references
var app = app || {};
if(_.isUndefined(app.Models)) app.Models = {};

/**
 * Game Model
 * This model holds all the game information and the logic
 * for interacting with the game socket.
 */
app.Models.Game = Backbone.Model.extend({

  players_per_room: 2,

  defaults: {
    socket_id: 0,
    role: ''
  },

  initialize: function() {
    _.bindAll(this, 'onConnected', 'onNewGameCreated', 'playerJoinedRoom');
    
    io.socket.on('connected', this.onConnected );
    io.socket.on('host:new_game_created', this.onNewGameCreated );
    io.socket.on('player:joined_room', this.playerJoinedRoom );
    io.socket.on('game:start_countdown', this.beginGameCountdown );
  },

  onConnected: function() {
    this.set('socket_id', io.socket.socket.sessionid);
    console.log("== Successfully opened a socket connection, my_socket_id = " + this.get('socket_id'));
  },

  onNewGameCreated: function(data) {
    console.log("== Game created", data);

    this.set('role', "Host");
    this.set('game_id', data.game_id);

    this.Players = new app.Collections.Players();

    Backbone.Events.trigger("game:created");
  },

  playerJoinedRoom: function(data) {
    console.log("== Player Joined", data);

    if(this.get('role') == "Host" && data.gameId == this.get('game_id')){
      this.Players.add({
        name: data.playerName,
        socket: data.mySocketId
      });

      if(this.Players.length == this.players_per_room){
        console.log("== Room limit reached, starting game!");

        io.socket.emit('host:start_countdown', this.get('game_id'));
      }
    } else {
      app.Router.navigate('waiting', {trigger: true});
    }
  },

  beginGameCountdown: function() {
    app.Router.navigate('game', {trigger: true});
  }
});