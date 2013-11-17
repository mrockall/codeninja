// Set up some references
var app = app || {};
if(_.isUndefined(app.Views)) app.Views = {};

/**
 * Backbone.View
 * Create Screen
 */
app.Views.Create = Backbone.View.extend({
    el: "#container",
    template: _.template( $( '#create_screen' ).html() ),

    initialize: function() {
      io.socket.emit("host:create_game");

      app.Game.on("game:created", this.game_created, this);
      
      return this;
    },

    render: function() {
      //this.el is what we defined in tagName. use $el to get access to jQuery html() function
      this.$el.html( this.template() );
      return this;
    },

    game_created: function() {
      this.$el.find(".game_details").text('We are now hosting game ID ' + app.Game.get('game_id'));
      app.Game.Players.on('add', this.player_has_joined, this);
    },

    player_has_joined: function(player) {
      var $li = $("<li></li>").text(player.get('name') + " has joined the game");
      this.$el.find(".players").append($li);
    }
});