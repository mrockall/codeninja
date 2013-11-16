// Set up some references
var app = app || {};
if(_.isUndefined(app.Views)) app.Views = {};

/**
 * Backbone.View
 * Join Screen
 */
app.Views.Join = Backbone.View.extend({
    el: "#container",
    template: _.template( $( '#join_screen' ).html() ),

    initialize: function() {

    },

    events: {
      'click .js_join_game': 'join_game'
    },

    render: function() {
      this.$el.html( this.template() );
      return this;
    },

    join_game: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var player_data = {
          playerName: this.$el.find(".js_name").val(),
          gameId: this.$el.find(".js_game_id").val()
      }
      io.socket.emit("player:join_game", player_data);
    }

});