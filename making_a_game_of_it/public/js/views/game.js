// Set up some references
var app = app || {};
if(_.isUndefined(app.Views)) app.Views = {};

/**
 * Backbone.View
 * Waiting Screen
 */
app.Views.Game = Backbone.View.extend({
    el: "#container",
    host_template: _.template( $( '#host_game_screen' ).html() ),
    player_template: _.template( $( '#player_game_screen' ).html() ),

    initialize: function() {
    },

    render: function() {
      if(app.Game.get('role') == 'Host') {
        this.$el.html( this.host_template() );
      } else {
        this.$el.html( this.player_template() );
      }

      this.countdown();
      return this;
    },

    countdown: function() {
      var start_time = 5,
          $countdown = this.$el.find(".countdown"),
          $count = $countdown.find(".count");

      $countdown.fadeIn(200);

      $count.text(start_time);
      setTimeout(_.bind(function(){
        $count.addClass('huge');
      }, this), 10);

      // Start a 1 second timer
      var timer = setInterval(_.bind(countItDown, this), 1100);

      // Decrement the displayed timer value on each 'tick'
      function countItDown(){

        start_time -= 1

        if( start_time <= 0 ){
          // Stop the timer and do the callback.
          clearInterval(timer);
          this.$el.find('.countdown').fadeOut();
          // game.IO.socket.emit('hostCountdownFinished', game.get("game_id"));
          return;
        }

        $count.text(start_time);
        $count.removeClass('huge');
        setTimeout(_.bind(function(){
          $count.addClass('huge');
        }, this), 100);
      }
    }
});