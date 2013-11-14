var app = app || {};

$(function() {

    // This hijcacks any link and routes it through out Backbone Router instead!
    $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
        var root = location.protocol + "//" + location.host + "/";

        if (href.prop.slice(0, root.length) === root) {
          evt.preventDefault();
          Backbone.history.navigate(href.attr, true);
        }
    });

    io.socket = io.connect();

    app.Router = new app.router();
    app.Game = new app.Models.Game();

    // This will tell Backbone to process the first route!
    Backbone.history.start({ pushState: true });
});