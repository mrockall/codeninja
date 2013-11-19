define([
  'app',
  'jquery',
  'underscore',
  'backbone',

  'views/_page',

  'text!templates/home.html'
], function(namespace, $, _, Backbone, Page, template){

  // Shorthand the app
  var app = namespace.app;

  /**
   * Backbone.View
   * Home Screen
   */
  return Page.extend({

    page_name: 'title_screen',
    raw_template: template,
  });
});