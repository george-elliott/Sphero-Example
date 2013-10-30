var Lightbox = Chute.View.extend({
  template: JST['lightbox'],
  container: 'body',
  bindings: {
    asset: '.asset',
    image: '.asset img',
    assetContainer: '.asset-container',
    lightboxWrapper: '.lightbox-horizontal-wrapper',
    lightbox: '.lightbox',
    loading: '.loading',
    caption: '.caption',
    meta: '.meta',
    sharing: '.sharing',
    nav: {
      controls: 'nav',
      current: 'span.current-photo',
      total: 'span.total-photos'
    }
  },
  events: {
    'click': function(e) { $(e.target).hasClass('modal-bg') || $(e.target).hasClass('lightbox-wrapper') ? this.destroy() : e.stopPropagation(); },
    'click a.close': 'destroy',
    'click a.next': 'nextAsset',
    'click a.prev': 'prevAsset',
    'click div.sharing a': 'trackSharing'
  },

  /* lightbox config options */
  preloader: {
    next: 2,
    prev: 0
  },

  initialize: function() {
    this.timestamp = new Date().getTime();

    if(!Display.hub.lightboxOpened) {
      analytics.track('Opened a lightbox', {
        asset: this.model.get('shortcut'),
        url: this.model.get('url'),
        time: ((new Date().getTime() - Display.hub.timestamp) / 1000).toFixed(2)
      });
      Display.hub.lightboxOpened = true;
    } else {
      analytics.track('Opened a lightbox', {
        asset: this.model.get('shortcut'),
        url: this.model.get('url')
      });
    }


    analytics.pageview();


    if (location.hash.indexOf(this.model.get('shortcut')) === -1) {
      Display.router.navigate(location.hash + '/' + this.model.get('shortcut'), { trigger: false });
    }

    $('body, html').css('overflow', 'hidden');


    this.listenToOnce(this, 'render', _.bind(function(){

      this.asset = new ItemView({model: this.model, parent: this, container: this.bindings.lightbox, size: '600xauto' });
      this.asset.render();
      this.bindings.nav.controls.prependTo(this.asset.bindings.asset);
      this.bindings.lightbox.hide();

      // add loading

      this.$el.imagesLoaded(_.bind(function(){

        this.bindings.lightbox.show().css('visibility', 'hidden');

        $(".lb-wrapper").css({top: $(window).scrollTop() + 'px'});

        fb.getOffset(_.bind(function(info) {
          var offset = parseInt(info.scrollTop);
          this.bindings.lightbox.css({top: offset + "px", position: 'absolute', left: '50%', 'margin-left': -(this.bindings.lightbox.outerWidth()/2) +'px'});
        }, this));


        this.bindings.lightbox.css('visibility', 'visible');
        this.bindings.loading.remove();

        this.resizeAsset();

      }, this));
    }, this));



    _.bindAll(this, 'keyboardAction');
    $(document).on('keyup', this.keyboardAction);
    this.debouncedResize = _.debounce(_.bind(this.resizeAsset, this), 50);
    $(window).on('resize', this.debouncedResize);

    this.currentAssetIndex = 1;


    this.options.nav = {
      current: this.currentAssetIndex + 1,
      total: Display.collections[this.options.gallery].length || 20
    }

    for(var i = 0; i < Display.collections[this.options.gallery].length; i++) {
      if(Display.collections[this.options.gallery].at(i).get('url') === this.model.get('url')) {
        this.currentAssetIndex = i;
        break;
      }
    }

    Display.lightbox = this;
  },

  resizeAsset: function() {

    var imageHeight = ($(window).height()-$(".lightbox .meta").outerHeight() - $(".lightbox .sharing").outerHeight());

    //this.bindings.nav.controls.css("height", imageHeight + 'px');
    $(".lightbox .asset img").css("max-height", imageHeight + 'px');
    $(".lightbox .video-js").css("height", imageHeight + 'px');
  },

  keyboardAction: function(e) {
    switch(e.which) {
      case 27: this.destroy(); break;
      case 37: this.prevAsset(e); break;
      case 39: this.nextAsset(e); break;
      default: e.stopPropagation();
    }
  },

  prevAsset: function(e) {
    e.preventDefault();

    analytics.track('Lightbox navigate', {
      direction: 'previous'
    });

    if (this.currentAssetIndex <= 0) return;
    this.goto(--this.currentAssetIndex);
  },

  nextAsset: function(e) {
    e.preventDefault();
    analytics.track('Lightbox navigate', {
      direction: 'next'
    });

    if (this.currentAssetIndex >= Display.collections[this.options.gallery].length - 1) return;
    this.goto(++this.currentAssetIndex);
  },

  goto: function(assetIndex) {
    var asset = Display.collections[this.options.gallery].at(assetIndex);
    if(! asset) return;

    this.model = asset;
    this.asset.destroy();
    this.asset = new ItemView({model: this.model, parent: this, container: this.bindings.lightbox, size: '600xauto' });
    this.asset.render();
    this.bindings.nav.controls.show();

    this.bindings.nav.controls.prependTo(this.asset.bindings.asset);
    this.preload();
    this.debouncedResize();
    Display.router.navigate(location.hash.substr(0, location.hash.indexOf("/")) + '/' + this.model.get('shortcut'), { trigger: false });
  },

  preload: function() {
    for (var i = 1; i <= this.preloader.next && this.currentAssetIndex + i < Display.collections[this.options.gallery].length; i++) {
      new Image().src = Display.collections[this.options.gallery].at(this.currentAssetIndex + i).get('url') + '/600xauto';
    }
    for (var i = 1; i <= this.preloader.prev && this.currentAssetIndex - i >= 0; i++) {
      new Image().src = Display.collections[this.options.gallery].at(this.currentAssetIndex - i).get('url') + '/600xauto';
    }
  },

  remove: function() {
    Display.router.navigate(location.hash.replace(/\/?\w+$/, ''), { trigger: false });

    delete this.options.view;

    $(document).off('keyup', this.keyboardAction);
    $(window).off('resize', this.debouncedResize);

    // remove overflow hidden
    $('body, html').css('overflow', '');

    analytics.track('Time in lightbox', {
      time: ((new Date().getTime() - this.timestamp) / 1000).toFixed(2)
    });
  }
});