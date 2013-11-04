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
      steps: ['customProfile', 'selector', 'thanks'],
      stepOptions: {
        customProfile: {
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
            type: "dob",
            name: "dob",
            label: "Date of Birth",
            required: true,
            match: "^([0-9]){4}-([0-9]){1,2}-([0-9]){1,2}$"
          }, {
            type: "checkbox",
            name: "newsletter",
            label: "Yes! I'd like to join the Sphero newsletter!",
            required: false
          }, {
            type: "checkbox",
            name: "privacy",
            label: "Yes I have read and agree to the privacy policy: (<a href=\"http://www.gosphero.com/privacy/\" target=\"_blank\" style=\"color:black;text-decoration:underline;\">Privacy Policy</a>)",
            required: true
          }]
        },
        selector: {
          title : "Select Your Photos",
          next : "Next",
          services : ["instagram", "twitter"]
        },
        thanks : {
          title : "Thank you",
          next : "Done",
          text : "Thank you! Your photos have been successfully uploaded."
        }
      }
    });
    // add a customized step
    chooser.step('customProfile', { template: SpheroChooser.Templates.customProfile({}), data: { title: "Profile", next: "Next" } });


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