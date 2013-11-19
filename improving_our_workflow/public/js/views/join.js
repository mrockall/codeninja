define([
  'app',
  'jquery',
  'underscore',
  'backbone',

  'views/_page',

  'text!templates/join.html'
], function(namespace, $, _, Backbone, Page, template){

  // Shorthand the app
  var app = namespace.app;

  /**
   * Backbone.View
   * Join Screen
   */
  return Page.extend({
    page_name: 'join_screen',
    raw_template: template,

    events: {
      'click .js_join_game': 'join_game'
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
});
  