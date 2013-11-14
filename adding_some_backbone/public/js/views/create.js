// Set up some references
var app = app || {};
if(_.isUndefined(app.Views)) app.Views = {};

/**
 * Backbone.View
 * Create Screen
 */
app.Views.Create = Backbone.View.extend({
    el: "#container",
    template: _.template( $( '#create_screen' ).html() ),

    render: function() {
      //this.el is what we defined in tagName. use $el to get access to jQuery html() function
      this.$el.html( this.template() );

      return this;
    }
});