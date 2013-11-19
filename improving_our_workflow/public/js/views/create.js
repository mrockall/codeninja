define([
  'app',
  'jquery',
  'underscore',
  'backbone',

  'views/_page',

  'text!templates/create.html'
], function(namespace, $, _, Backbone, Page, template){

  // Shorthand the app
  var app = namespace.app;

  /**
   * Backbone.View
   * Home Screen
   */
  return Page.extend({

    page_name: 'create_screen',
    raw_template: template,

    _pageInit: function() {
      io.socket.emit("host:create_game");
      app.Game.on("game:created", this.game_created, this);
    },

    game_created: function() {
      this.$el.find(".js_game_id").text(app.Game.get('game_id'));
      app.Game.Players.on('add', this.player_has_joined, this);
    },

    player_has_joined: function(player) {
      this.$el.find(".players .none").fadeOut(_.bind(function(){
        var $li = $("<li></li>").text(player.get('name') + " has joined the game");
        this.$el.find(".players").append($li).slideDown();
      }, this));
    }
  });
});
