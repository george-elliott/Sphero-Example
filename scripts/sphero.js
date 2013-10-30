(function($){
  //= require display
  Display.ready(function(){
    //= require utils/detect
    //= require utils/video
    //= require utils/share
    //= require utils/highlight
    //= require item_view
    //= require lightbox
    //= require_tree wall
    //= require_tree tabs
    //= require utils/facebook
    //= require hub

    Display.collections.popular.option('sort', 'hot');

    Display.hub = new Hub({
      container: Display.container
    });

    Display.hub.render();

    Display.tabs = {
      recent: new RecentTab({ parent: Display.hub }),
      popular: new PopularTab({ parent: Display.hub }),
      picks: new PicksTab({ parent: Display.hub }),
      terms: new TermsTab({ parent: Display.hub })
    };

    Display.tabs.recent.render();
    Display.tabs.popular.render();
    Display.tabs.picks.render();
    Display.tabs.terms.render();

    Display.hub.updateBindings();

    var Router = Backbone.Router.extend({
      routes: {
        'recent(/:shortcut)': 'recent',
        'popular(/:shortcut)': 'popular',
        'picks(/:shortcut)': 'picks',
        'terms': 'terms',
        ':shortcut': 'recent',
        '': 'recent'
      },

      rendered: {},

      openLightbox: function(options, page) {
        var asset = new Chute.Models.Asset(null, options);
        asset.fetch({
          success: function(){
            new Lightbox({
              model: asset,
              gallery: page
            }).render();
          }
        });
      },


      recent: function(shortcut) {
        if(shortcut) this.openLightbox({ album: Display.albums.recent, asset: shortcut }, 'recent');

        Display.hub.setActiveTab('recent');

        if(this.rendered['recent']) return;

        Display.collections.recent.fetch({ remove: false });

        this.rendered['recent'] = true;
      },

      popular: function(shortcut) {
        if(shortcut) this.openLightbox({ album: Display.albums.recent, asset: shortcut }, 'popular');

        Display.hub.setActiveTab('popular');

        if(this.rendered['popular']) return;

        Display.collections.popular.fetch({ remove: false });

        this.rendered['popular'] = true;
      },

      picks: function(shortcut) {
        if(shortcut) this.openLightbox({ album: Display.albums.picks, asset: shortcut }, 'picks');

        Display.hub.setActiveTab('picks');

        if(this.rendered['picks']) return;

        Display.collections.picks.fetch({ remove: false });

        this.rendered['picks'] = true;
      },

      terms: function() {

        Display.hub.setActiveTab('terms');

        if(this.rendered['terms']) return;

        this.rendered['terms'] = true;
      }
    });

    Display.router = new Router();

    //= require analytics
  });
})(window.jQueryChute || jQuery);