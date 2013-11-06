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
    }, this));
  },
  upload: function() {
    fb.scrollTo(0,0);

    var chooser = new Chute.Chooser({
      client_id: Display.mediachooser.clientId,
      album: Display.mediachooser.album,
      steps: ['profile', 'privacy', 'selector'],
      stepOptions: {
        profile: {
          title : "Profile",
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
            type: "text",
            name: "Date of Birth",
            label: "Date of Birth (MM-DD-YYYY)",
            required: true,
            match: "^([0-9]){1,2}-([0-9]){1,2}-([0-9]){4}$"
          }, {
            type: "checkbox",
            name: "newsletter",
            label: "Yes! I'd like to join the Sphero newsletter!",
            required: false
          }]
        },
        privacy: {
          title: "Please read and agree to the privacy policy",
          next: "I Agree",
          template: "<a href=\"http://www.gosphero.com/privacy/\" target=\"_blank\" style=\"color:black;text-decoration:underline;\">Privacy Policy</a>"
        },
        selector: {
          title : "Select Your Videos",
          next : "Next",
          services : ["upload", "instagram", "twitter"]
        },
        thanks : {
          title : "Thank you",
          next : "Done",
          text : "Thank you! Your videos have been successfully uploaded."
        }
      }
    });

    chooser.on('complete', function(data){
      chooser.goToStep('thanks')
    });


    chooser.on('on:thanks:complete', function(data){
      chooser.close();
    });

    chooser.show();
  }
});