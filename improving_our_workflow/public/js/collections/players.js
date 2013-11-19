define([
  'app',
  'jquery',
  'underscore',
  'backbone',

  'models/player'
], function(namespace, $, _, Backbone, PlayerModel){

  return Backbone.Collection.extend({
    model: PlayerModel,

    comparator: 'score',

    getBySocketID: function(socket) {
      return this.where({socket: socket});
    }
  });
});