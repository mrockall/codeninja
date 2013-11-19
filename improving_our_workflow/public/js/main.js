/*global require*/
'use strict';

require.config({
  paths: {
    jquery: '../components/jquery/jquery.min',
    backbone: '../components/backbone/backbone-min',
    underscore: '../components/underscore/underscore-min',
    text: "../components/requirejs-text/text",
    templates: "../templates"
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }
  }
});

require([
  'app',
  'backbone',
  'router',

  'models/game'
], function (namespace, Backbone, Router, GameModel) {

  var app = namespace.app;
  window.app = app;

  app.Router = new Router.MainRouter()
  app.Game = new GameModel.Game();

  // This will tell Backbone to process the first route!
  Backbone.history.start({ pushState: true });

  // This hijacks any link and routes it through out Backbone Router instead!
  $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    var root = location.protocol + "//" + location.host + "/";

    if (href.prop.slice(0, root.length) === root) {
      evt.preventDefault();
      Backbone.history.navigate(href.attr, true);
    }
  });

});