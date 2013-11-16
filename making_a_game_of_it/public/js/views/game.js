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
      console.log('Here');
    },

    render: function() {

      if(app.Game.get('role') == 'Host') {
        this.$el.html( this.host_template() );
      } else {
        this.$el.html( this.player_template() );
      }

      return this;
    }
});