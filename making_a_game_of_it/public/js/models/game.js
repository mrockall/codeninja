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
  points_per_round: 100,
  number_of_rounds: 4,

  defaults: {
    socket_id: 0,
    role: '',
    current_round: 0
  },

  initialize: function() {
    _.bindAll(this, 'onConnected', 'onNewGameCreated', 'playerJoinedRoom', 'newRoundData', 'checkAnswer');
    
    io.socket.on('connected', this.onConnected );
    io.socket.on('host:new_game_created', this.onNewGameCreated );
    io.socket.on('host:check_answer', this.checkAnswer );
    io.socket.on('player:joined_room', this.playerJoinedRoom );
    io.socket.on('game:start_countdown', this.beginGameCountdown );
    io.socket.on('game:new_round_data', this.newRoundData )
    io.socket.on('game:over', this.endGame );
  },

  isHost: function() { return this.get('role') == 'Host'; },

  decreaseAvailablePoints: function() { 
    this.set('available_points', this.get('available_points') - 1); 
    return this.get('available_points');
  },

  onConnected: function() {
    this.set('socket_id', io.socket.socket.sessionid);
    console.log("== Successfully opened a socket connection, my_socket_id = " + this.get('socket_id'));
  },

  onNewGameCreated: function(data) {
    console.log("== Game created", data);

    this.set('role', "Host");
    this.set('game_id', data.game_id);
    this.set('current_round', 0);

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
    app.Router.navigate('game', {trigger: true, replace: true});
  },

  getRound: function() {
    this.set('current_round', this.get('current_round') + 1);

    if(this.get('current_round') > this.number_of_rounds){
      io.socket.emit('game:over', this.get('game_id'));
    } else {
      io.socket.emit('game:get_round', this.get('game_id'));
    }
  },

  newRoundData: function(data) {
    console.log("== New Round Data ", data);
    this.set('round_answer', data.team);
    this.set('available_points', this.points_per_round);
    this.set('number_of_player_answers', 0);
    this.trigger('game:render_round_data', data);
  },

  playerAnswer: function(answer) {
    var data = {
        gameId: this.get("game_id"),
        playerId: this.get("socket_id"),
        answer: answer,
        round: this.get("current_round")
    };
    io.socket.emit('player:answer',data);
  },

  checkAnswer: function(answer) {
    if(this.isHost()){
      this.set('number_of_player_answers', this.get('number_of_player_answers') + 1);

      if(answer.answer == this.get('round_answer')){
        console.log("== Correct Answer: Award this many points", this.get('available_points'));
        var player = this.Players.getBySocketID(answer.playerId)[0];
        player.give_score(this.get('available_points'));
      }

      // If everyone has answered this round, new round!
      if(this.get('number_of_player_answers') == this.Players.length){
        this.getRound();
      }
    }
  },

  forceNextRound: function() {
    this.getRound();
  },

  endGame: function() {
    console.log("== End Game");
    app.Router.navigate('gameover', {trigger: true, replace: true});
  }
});