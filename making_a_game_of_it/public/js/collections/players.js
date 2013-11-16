var app = app || {};
if(_.isUndefined(app.Collections)) app.Collections = {};

app.Collections.Players = Backbone.Collection.extend({
    model: app.Models.Player,
    players_per_game: 2,

    initialize: function() {
      this.on('add', this.game_start, this);
    },

    game_start: function() {
      if(this.length == this.players_per_game){
        Backbone.Events.trigger('game:countdown');
      }
    }
});