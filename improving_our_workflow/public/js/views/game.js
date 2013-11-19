define([
  'app',
  'jquery',
  'underscore',
  'backbone',

  'views/_page',

  'text!templates/game_host.html',
  'text!templates/game_player.html',
  'text!templates/player_card.html'
], function(namespace, $, _, Backbone, Page, hostTemplate, playerTemplate, playerCard){

  // Shorthand the app
  var app = namespace.app;

  /**
   * Backbone.View
   * Game Screen
   */
  return Page.extend({
    page_name: 'game_screen',

    _pageInit: function() {
      app.Game.on('game:render_round_data', this.renderRound, this);
    },

    events: {
      "click .option": "answer_selected"
    },

    template: function() {
      if(app.Game.isHost()){
        return _.template(hostTemplate);
      } else {
        return _.template(playerTemplate);
      }
    },

    _renderPageContent: function() {
      if(app.Game.isHost()) {
        this.render_player_cards();
        this.countdown();
      }
    },

    countdown: function() {
      var start_time = 2,
          $countdown = this.$el.find(".countdown"),
          $count = $countdown.find(".count");

      $countdown.fadeIn(200);

      $count.text(start_time);
      setTimeout(_.bind(function(){
        $count.addClass('huge');
      }, this), 10);

      // Start a 1 second timer
      var timer = setInterval(_.bind(countItDown, this), 1100);

      // Decrement the displayed timer value on each 'tick'
      function countItDown(){

        start_time -= 1

        if( start_time <= 0 ){
          // Stop the timer and do the callback.
          clearInterval(timer);
          this.$el.find('.countdown').fadeOut();
          app.Game.getRound();
          return;
        }

        $count.text(start_time);
        $count.removeClass('huge');
        setTimeout(_.bind(function(){
          $count.addClass('huge');
        }, this), 100);
      }
    },

    renderRound: function(data) {
      if(app.Game.isHost()){
        this.render_picture(data.team);
        this.start_round_timer();
        this.$el.find('.round .current').text(app.Game.get('current_round'));
        this.$el.find('.round .total').text(app.Game.number_of_rounds);
      } else {
        this.$el.find(".option.tl .inner").text(data.answers[0]);
        this.$el.find(".option.tr .inner").text(data.answers[1]);
        this.$el.find(".option.bl .inner").text(data.answers[2]);
        this.$el.find(".option.br .inner").text(data.answers[3]);
      }
    },

    render_picture: function(team) {
      var $picture = this.$el.find('.picture'),
          w = $picture.width(),
          h = $picture.height();

      if(w > h){
        $picture.width(h);
      } else {
        $picture.height(w);
      }

      $picture.css('background-image', 'url(css/img/' + team.replace(/ /g,"_").toLowerCase() + '.png)');
    },

    answer_selected: function(ev) {
      app.Game.playerAnswer($(ev.currentTarget).find(".inner").text());
    },

    start_round_timer: function() {
      var $timer_el = this.$el.find('.timer');
      
      clearInterval(this.points_counter);
      this.points_counter = setInterval(_.bind(timer, this), 10);

      function timer()
      {
        var points = app.Game.decreaseAvailablePoints();
        $timer_el.text(points);

        if (points <= 0)
        {
          app.Game.forceNextRound();
          clearInterval(this.points_counter);
          return;
        }
      }
    },

    render_player_cards: function() {
      var $score_cards = this.$el.find('.score_cards')
          template = playerCard;

      app.Game.Players.each(_.bind(function(m, i){
        var $li = $(template);
        $li.addClass('sckt_' + m.get('socket'));
        $li.find('.name').text(m.get('name'));
        $li.find('.score').text(m.get('score'));

        $score_cards.append($li);

        m.on('change:score', this.update_player_score, $li);
      }, this));
    },

    update_player_score: function(a) {
      this.find('.score').text(a.get('score'));
    }
  });  

});