define([
  'app',
  'jquery',
  'underscore',
  'backbone',

  'views/_page',

  'text!templates/join.html'
], function(namespace, $, _, Backbone, Page, template){

  // Shorthand the app
  var app = namespace.app;

  /**
   * Backbone.View
   * Waiting Screen
   */
  return Page.extend({
    page_name: 'waiting_screen',
    raw_template: template
  });    
});