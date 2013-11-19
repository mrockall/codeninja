define([
  'app',
  'jquery',
  'underscore',
  'backbone'
], function(namespace, $, _, Backbone){

  /**
   * Player Model
   */
  return Backbone.Model.extend({
    defaults: {
      name: '',
      socket: '',
      score: 0
    },

    give_score: function(score) {
      this.set('score', this.get('score') + score);
    }
  });
});