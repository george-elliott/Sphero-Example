var ItemView = Chute.View.extend({
  template: JST['item_view'],
  bindings: {
    'like': '.voting',
    'vote': '.voting .vote',
    'thanks': '.voting .thanks',
    'hearts': 'span.likes-number',
    'asset': '.asset',
    'image': '.asset img',
    'video': '.asset video',
  },
  events: {
    'click .vote': 'vote',
    'click div.sharing a': 'trackSharing'
  },
  append: false,
  initialize: function() {
    if(this.model.get("caption")) {
      this.model.attributes.caption = Highlight.highlightCaption(this.model.get("caption").replace(/<(?:.|\n)*?>/gm, ''), this.model.get('service'));
    }

    this.options.video = {
      width: 500,
      height: 500,
      id: this.model.get('id')
    };

    this.listenTo(this, 'render', _.bind(function() {
      this.isLightbox = $(this.container).hasClass("lightbox");
      var album = (typeof this.model.collection === 'undefined') ? this.model.options.album : this.model.collection.options.album;
      if (this.isLightbox && (album === Display.albums.picks)) { 
        this.bindings.like.hide(); 
      }
      if (!this.isLightbox && !$(this.el).closest('.picks').length) {
        this.$el.hover(_.debounce(_.bind(function() {
          if (!this.isHearted) {
            this.bindings.vote.slideDown();
          }
        }, this), 500, true), _.debounce(_.bind(function() {
          this.bindings.vote.slideUp();
        }, this), 500, true));
      }
      if(this.model.get("type") == 'video' && (this.isLightbox || detect.isMobile())) {
        try {
          this.video = videojs('video-' + this.model.get('id'), {
            controls: true,
            autoplay: false,
            preload: false
          });

          this.video.volume(0);
          this.bindings.image.hide();
          this.video.isPaused = true;

          this.video.dimensions(this.bindings.asset.outerWidth(),this.bindings.asset.outerWidth());
        } catch(e) {
          this.bindings.image.show();
          this.bindings.video.hide();
          this.video.dispose();
          this.video.hide();
        }


        // video events
        this.video.on('error', _.bind(function(){
          this.bindings.image.show();
          this.video.hide();
        }, this));

        this.video.on('play', _.bind(function() {
          this.$el.find('nav').hide();
          this.video.isPaused = false;
        }, this));

        this.video.on('pause', _.bind(function() {
          this.$el.find('nav').show();
          this.video.bigPlayButton.show();
          this.video.isPaused = true;
        }, this));

        this.video.on('ended', _.bind(function() {
          this.$el.find('nav').show();
          this.video.isPaused = true;
        }, this));


      } else {
        this.bindings.video.hide();
      }
    }, this));


    _.bindAll(this, 'keyboardAction');
    $(document).on('keyup', this.keyboardAction);


    var share = new Share({
      awesm: {
        campaign: 'sphero-tab'
      },
      url: location.href,
      caption: 'Sphero Tricks', // second line
      asset: this.model.get('url'),
      text: 'Show us what you can do with Sphero or create a human-powered trick using anything from a soccer ball to a parkour-wall for the chance to win a Sphero 2.0 and custom trick pack.',
      facebook: {
        title: 'You\'ve Got Tricks with Balls',
        redirect: 'http://www.getchute.com/close.html', // closes the window
        appId: '143143919079785' // chute fb
      }
    }).generate();

    this.options = _.extend(this.options, {
      facebook_share_url: share.facebook,
      twitter_share_url: share.twitter,
      pinterest_share_url: share.pinterest,
      tumblr_share_url: share.tumblr
    });
  },
  vote: function() {
    var event;
    this.bindings.vote.hide();
    this.bindings.thanks.show();
    if(this.bindings.like.hasClass('active')) {
      this.model.unheart();
      event = 'Unliked';
    } else {
      this.model.heart();
      this.isHearted = true;
      event = 'Liked';
    }
    this.bindings.like.toggleClass('active');
    if (!this.isLightbox) { this.bindings.thanks.slideUp(1000); }
    analytics.track(event + ' an asset', {
      asset: this.model.get('shortcut'),
      url: this.model.get('url')
    });
  },
  trackSharing: function(e) {
    var $el = $(e.currentTarget),
        network;

    if($el.hasClass('facebook')) {
      network = 'facebook';
    } else if($el.hasClass('twitter')) {
      network = 'twitter';
    } else if($el.hasClass('pinterest')) {
      network = 'pinterest';
    } else if($el.hasClass('tumblr')) {
      network = 'tumblr';
    }  else {
      return;
    }

    analytics.track('Shared an asset on ' + network, {
      asset: this.model.get('shortcut'),
      url: this.model.get('url')
    });
  },
  remove: function() {
    if(this.video) {
      this.video.pause();
      this.video.dispose();
      delete this.video;
    }

    $(document).off('keyup', this.keyboardAction);
  },
  keyboardAction: function(e) {
    switch(e.which) {
      case 32:
        if(this.video) {
          if(this.video.isPaused) {
            this.video.play();
          } else {
            this.video.pause();
          }
        }
        break;
      default: e.stopPropagation();
    }
  }

});