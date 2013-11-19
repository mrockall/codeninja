define([
  'app',
  'backbone',

  'views/home',
  'views/create',
  'views/join',
  'views/waiting',
  'views/game'
], function (namespace, Backbone, HomePage, CreatePage, JoinPage, WaitingPage, GamePage) {

  // Shorthand the app
  var app = namespace.app, obj = {};

  obj.MainRouter = Backbone.Router.extend({

    current_page: '',
    pages: [],

    page_lookup: {
      "home_page" : HomePage,
      "create_page" : CreatePage,
      "join_page" : JoinPage,
      "waiting_page" : WaitingPage,
      "game_page" : GamePage
    },

    routes: {
      "": "index",
      "create": "create",
      "join": "join",
      "waiting": "waiting",
      "game": "game",
      "gameover": "gameover"
    },

    index: function() {
      this.showPage('home_page');
    },

    create: function() {
      this.showPage('create_page');
    },

    join: function() {
      this.showPage('join_page');
    },

    waiting: function() {
      this.showPage('waiting_page');
    },

    game: function() {
      this.showPage('game_page');
      new app.Views.Game().render();
    },

    gameover: function() {
      new app.Views.GameOver().render();
    },

    showPage: function(page_name, params) {
      if(this.current_page != page_name){
        this._hideCurrentPage();
      }

      this.current_page = page_name;

      this._getOrInitPage(page_name, params).show();
    },

    _hideCurrentPage: function() {
      if(this.current_page){
        this._getOrInitPage(this.current_page).hide();
        this.current_page = "";
      }
    },

    _getOrInitPage: function(page_name, params){
      params = typeof params !== 'undefined' ? params : {};
      
      if(!this.pages.hasOwnProperty(page_name)){
        this.pages[page_name] = new this.page_lookup[page_name]({$content: $('#container'), params: params}).render();
      }

      return this.pages[page_name];
    }
  });

  return obj;
});