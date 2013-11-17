var app = app || {};
if(_.isUndefined(app.Collections)) app.Collections = {};

app.Collections.Players = Backbone.Collection.extend({
    model: app.Models.Player,

    getBySocketID: function(socket) {
      return this.where({socket: socket});
    }
});