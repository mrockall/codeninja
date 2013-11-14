var app = app || {};

app.router = Backbone.Router.extend({

  routes: {
    "": "index",
    "create": "create",
    "join": "join"
  },

  index: function() {
    new app.Views.Home().render();
  },

  create: function() {
    new app.Views.Create().render();
  },

  join: function() {
    new app.Views.Join().render();
  }
});