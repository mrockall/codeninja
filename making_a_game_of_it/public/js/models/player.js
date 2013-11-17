// Set up some references
var app = app || {};
if(_.isUndefined(app.Models)) app.Models = {};

/**
 * Player Model
 */
app.Models.Player = Backbone.Model.extend({
  defaults: {
    name: '',
    socket: '',
    score: 0
  },

  give_score: function(score) {
    this.set('score', this.get('score') + score);
  }
});