// Set up some references
var app = app || {};
if(_.isUndefined(app.Models)) app.Models = {};

/**
 * Game Model
 */
app.Models.Game = Backbone.Model.extend({
  defaults: {
    socket_id: 0
  },

  initialize: function() {
    _.bindAll(this, 'onConnected');
    
    io.socket.on('connected', this.onConnected );
  },

  onConnected: function() {
    this.set('socket_id', io.socket.socket.sessionid);
    console.log("== Successfully opened a socket connection, my_socket_id = " + this.get('socket_id'));
  }
});