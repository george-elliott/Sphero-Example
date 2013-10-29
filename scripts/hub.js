var Hub = Chute.View.extend({
  template: JST['hub'],
  bindings: {
    tabsMenuItems: 'div.tabs-menu li',
    tabs: 'div.tab',
    panel: 'div.panel'
  },
  events: {
    'click .upload-button': 'upload'
  },

  activeTab: '',

  setActiveTab: function(name) {
    this.bindings.tabsMenuItems.removeClass('active');
    this.bindings.tabsMenuItems.filter('[data-tab-name="' + name + '"]').addClass('active');
    this.bindings.tabs.removeClass('active');
    this.bindings.tabs.filter('[data-tab-name="' + name + '"]').addClass('active');
    this.activeTab = name;

    //analytics.pageview();
    analytics.track('Opened a ' + name + ' tab');

    // hide address panel on mobile
  },
  scrollToMenu: function() {
    window.scrollTo(0,this.parent.bindings.headline.offset().top);
    fb.scrollTo(0,this.parent.bindings.headline.offset().top);
  },
  lightboxOpened: false,

  initialize: function() {
    fb.init();
    this.listenTo(this, 'render', _.bind(function() {
      this.timestamp = new Date().getTime();
      // is iframe
      if ( window.self !== window.top ) {
        $("body").css('overflow','hidden');
      }
      fb.autoGrow();
    }, this));
  },
  upload: function() {
    fb.scrollTo(0,0);

    var chooser = new Chute.Chooser({
      client_id: Display.mediachooser.clientId,
      album: Display.mediachooser.album
    });

    chooser.on('complete', function(response){
      chooser.close();
      // todo: add thank you message or add images to display
    });

    chooser.show();
  }
});