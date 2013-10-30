var ItemView = Chute.View.extend({
  template: JST['item_view'],
  bindings: {
    'like': 'div.like',
    'hearts': 'span.likes-number',
    'asset': '.asset',
    'image': '.asset img',
    'video': '.asset video',
    'nav': 'nav'
  },
  events: {
    'click .like': 'like',
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
      var isLightbox = $(this.container).hasClass("lightbox");


      if(this.model.get("type") == 'video' && (isLightbox || detect.isMobile())) {
        console.log('is video and should be shown');
        try {
          console.log('trying video');
          this.video = videojs('video-' + this.model.get('id'), {
            controls: true,
            autoplay: false,
            preload: false
          });



          this.video.volume(0);
          this.bindings.image.hide();

          this.video.dimensions(this.bindings.asset.outerWidth(),this.bindings.asset.outerWidth());
        } catch(e) {
          console.log('error', e);
          console.log('hello');
          //this.$el.imagesLoaded(_.bind(this.show, this, 'image'));
          this.bindings.image.show();
          this.bindings.video.hide();
          console.log(this.video);
          this.video.dispose();
          this.video.hide();
        }

        console.log(this.video);
        window.video = this.video;

        this.video.on('error', _.bind(function(){
          console.log('video error ha');
          console.log(this.video);
          this.bindings.image.show();
          this.video.hide();
          //this.$el.imagesLoaded(_.bind(this.show, this, 'image'));
        }, this));

        // video event
        this.video.on('play', _.bind(function() {
          console.log('play');
          console.log(this.bindings);
          this.bindings.nav.hide();
        }, this));

        this.video.on('ended', _.bind(function() {
          console.log('play');
          this.bindings.nav.show();
        }, this));

      } else {
        this.bindings.video.hide();
      }
    }, this));



    var share = new Share({
      awesm: {
        campaign: ''
      },
      url: location.href,
      caption: '', // second line
      asset: this.model.get('url'),
      text: '',
      facebook: {
        title: '',
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
  like: function() {
    var event;

    if(this.bindings.like.hasClass('active')) {
      this.model.unheart();
      event = 'Unliked';
    } else {
      this.model.heart();
      event = 'Liked';
    }

    this.bindings.like.toggleClass('active');
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
  }

});