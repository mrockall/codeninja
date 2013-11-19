define([
  'app',
  'jquery',
  'underscore',
  'backbone',

  'views/_page',

  'text!templates/game_over.html'
], function(namespace, $, _, Backbone, Page, template){

  // Shorthand the app
  var app = namespace.app;

  /**
   * Backbone.View
   * Waiting Screen
   */
  return Page.extend({
    page_name: 'game_over_screen',
    raw_template: template,

    _renderPageContent: function() {
      if(app.Game.isHost()){

        var $ul = this.$el.find(".final_scores")
        app.Game.Players.each(_.bind(function(m, i){
          var $li = $('<li><span class="score"></span><span class="name"></span></li>');

          $li.find('.score').text(m.get('score'));
          $li.find('.name').text(m.get('name'));
          $ul.append($li);

        }, this));
      }
    }
  });    
});