var app = app || {};

app.router = Backbone.Router.extend({

  routes: {
    "": "index",
    "create": "create",
    "join": "join",
    "waiting": "waiting"
  },

  index: function() {
    new app.Views.Home().render();
  },

  create: function() {
    new app.Views.Create().render();
  },

  join: function() {
    new app.Views.Join().render();
  },

  waiting: function() {
    new app.Views.Waiting().render();
  }
});