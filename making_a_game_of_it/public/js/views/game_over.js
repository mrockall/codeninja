// Set up some references
var app = app || {};
if(_.isUndefined(app.Views)) app.Views = {};

/**
 * Backbone.View
 * Waiting Screen
 */
app.Views.GameOver = Backbone.View.extend({
    el: "#container",
    template: _.template( $( '#game_over_screen' ).html() ),

    render: function() {
      this.$el.html( this.template() );

      if(app.Game.isHost()){
        this.$el.find(".actions").hide();

        var $ul = this.$el.find(".final_scores")
        app.Game.Players.each(_.bind(function(m, i){
          var $li = $('<li><span class="score"></span><span class="name"></span></li>');

          $li.find('.score').text(m.get('score'));
          $li.find('.name').text(m.get('name'));
          $ul.append($li);

        }, this));
      } else {
        this.$el.find(".final_scores").hide();
      }

      return this;
    }
});