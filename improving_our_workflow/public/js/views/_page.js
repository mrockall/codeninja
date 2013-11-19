define([
  'app',
  'jquery',
  'underscore',
  'backbone'
], function(namespace, $, _, Backbone){

  var app = namespace.app;

  return Backbone.View.extend({

    className: 'page',
    page_title: "Logo Picker",

    initialize: function(params) {
      this.$content = params.$content;
      document.title = this.page_title;

      this._pageInit(params);
      return this;
    },

    template: function() {
      return _.template(this.raw_template);
    },

    _pageInit: function(){},

    render: function() {
      this.$el.append(this.template()).addClass(this.page_name);
      this.$content.append(this.$el);

      this.$page_content = this.$el.find(".content");

      this._renderPageContent();
      return this;
    },

    _renderPageContent: function() {},

    show: function() {
      if(!this.$el.is(":visible")){
        this.$el.fadeIn();
      }
    },

    hide: function() {
      this.$el.hide();
    }
  });

}); 