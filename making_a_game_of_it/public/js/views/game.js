// Set up some references
var app = app || {};
if(_.isUndefined(app.Views)) app.Views = {};

/**
 * Backbone.View
 * The Game Screen
 */
app.Views.Game = Backbone.View.extend({
    el: "#container",
    host_template: _.template( $( '#host_game_screen' ).html() ),
    player_template: _.template( $( '#player_game_screen' ).html() ),

    initialize: function() {
      app.Game.on('game:render_round_data', this.renderRound, this);
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
      var start_time = 2,
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
          if(app.Game.isHost()){
            app.Game.getRound(0);
          }
          return;
        }

        $count.text(start_time);
        $count.removeClass('huge');
        setTimeout(_.bind(function(){
          $count.addClass('huge');
        }, this), 100);
      }
    },

    renderRound: function(data) {
      if(app.Game.isHost()){
        this.render_picture(data.team);
      } else {
        this.$el.find(".option.tl .inner").text(data.answers[0]);
        this.$el.find(".option.tr .inner").text(data.answers[1]);
        this.$el.find(".option.bl .inner").text(data.answers[2]);
        this.$el.find(".option.br .inner").text(data.answers[3]);
      }
    },

    render_picture: function(team) {
      var $picture = this.$el.find('.picture'),
          w = $picture.width(),
          h = $picture.height();

      if(w > h){
        $picture.width(h);
      } else {
        $picture.height(w);
      }

      $picture.css('background-image', 'url(css/img/' + team + '.png)');
    }
});