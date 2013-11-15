// Set up some references
var app = app || {};
if(_.isUndefined(app.Models)) app.Models = {};

/**
 * Game Model
 */
app.Models.Game = Backbone.Model.extend({
  defaults: {
    socket_id: 0,
    role: ''
  },

  initialize: function() {
    _.bindAll(this, 'onConnected', 'onNewGameCreated', 'playerJoinedRoom');
    
    io.socket.on('connected', this.onConnected );
    io.socket.on('host:new_game_created', this.onNewGameCreated );
    io.socket.on('player:joined_room', this.playerJoinedRoom );
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
    } else {
      app.Router.navigate('waiting', {trigger: true});
    }
  }
});