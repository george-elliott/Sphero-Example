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

    analytics.pageview();
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
      album: Display.mediachooser.album,
      steps: ['styles', 'selector', 'profile'],
      stepOptions: {
        profile: {
          title : "Contact information",
          next : "Next",
          fields: [{
            type: "text",
            name: "name",
            label: "Name",
            required: true
          }, {
            type: "text",
            name: "email",
            label: "Email",
            required: true,
            match: "^([^@\\s]+)@((?:[-a-z0-9]+\\.)+[a-z]{2,})$"
          }, {
            type: "checkbox",
            name: "agree",
            label: "I agree with <a href=\"\" target=\"_blank\">Terms & Conditions</a>",
            required: true
          }]
        },
        selector: {
          title : "Select Your Photos",
          next : "Next",
          services : ["upload", "facebook", "flickr", "google", "instagram"]
        },
        thanks: {
          title: "Upload successful",
          next: "Done",
          text: "Thank you, your submission was succcessful."
        }
      }
    });

    chooser.on('before:media:submission', function(data, done) {
      _.each(data.media, function(asset) {
        if (asset.account_username === '') {
          asset.account_username = data.profile.name;
          delete asset.account_shortcut;
        }
      });
      done(data);
    });

    chooser.on('complete', function(response){
      chooser.goToStep('thanks');
    });

    chooser.on('before:thanks:change', function() {
      chooser.close();
    });

    chooser.show();
  }
});