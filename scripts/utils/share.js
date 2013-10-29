/* stolen from Chute.js - v1.1.0, where this is, doesn't work in IE9 */

var Share = (function(){
  /**
   * List of available parameters:
   *
   * - **url** - URL to share
   * - **text** - text for sharing
   * @method initialize
   * @param {object} params - parameters for a generator
   * @example
   var share = new Share({
            'text': 'This is a cool photo!',
            'url': 'http://test.com/post/beautiful-photo'
          });
   */
  function Share(params){
    // for backwards compatibility
    // TODO: remove if no one depends on it
    params.awesm = (params.awesm || {});
    if (params.album) {
      params.awesm.campaign = 'chute-' + params.album;
      delete params.album;
    }
    if (params.widget) {
      params.awesm.tool = 'widget-' + params.widget;
      delete params.widget;
    }

    var defaultsDeep = _.partialRight(_.merge, _.defaults);
    this.params = defaultsDeep(params, this.defaults);
  }

  Share.prototype.params = Share.prototype.defaults = {
    awesm: {
      key: 'b0bfb8197b229269d456b2d7b476ec769038ebd64015eb05a663257e8b3d833d',
      tool: 'vtrfsk',  // Chute.js Displays' code
      campaign: 'chute'
    },
    bitly: {
      apiKey: ''
    },
    facebook: {
      title: '',
      redirect: ''
    },
    twitter: {},
    pinterest: {},
    gplus: {},
    tumblr: {}
  };

  /**
   * Configure Share object after initialization
   * @method configure
   * @param {object} params - parameters for a generator
   * @example
   var share = new Chute.Share;
   share.configure({
            'text': 'This is a cool photo!',
            'url': 'http://test.com/post/beautiful-photo'
          });
   */
  Share.prototype.configure = function(params) {
    for(key in params) {
      this.params[key] = params[key];
    }
  };

  Share.prototype._shorten = function(url, callback) {
    $.ajax({
      url: 'http://api.bitly.com/v3/shorten',
      jsonp: true,
      data: {
        apiKey: this.params.bitly.apiKey,
        login: this.params.bitly.login,
        longUrl: url
      },
      dataType: 'json',
      success: function(response){
        callback(response.data.url);
      }
    });
  };

  /**
   * Generate sharing links
   * @method generate
   * @return {object}
   * @example
   var links = share.generate();

   // links.twitter
   // links.pinterest
   // links.facebook
   // links.tumblr
   // links.gplus
   */
  Share.prototype.generate = function(callback) {
    var self = this;

    if(/\:url/.test(this.params.text)) {
      this.params.text = this.params.text.replace(':url', 'AWESM_URL');
    } else {
      this.params.text += ' AWESM_URL';
    }

    _.each(this.params, _.bind(function(value, key){
      if(_.contains(['twitter', 'facebook', 'pinterest', 'gplus', 'tumblr'], key) && this.params[key].text) {
        if(/\:url/.test(this.params[key].text)) {
          this.params[key].text = this.params[key].text.replace(':url', 'AWESM_URL');
        } else {
          this.params[key].text += ' AWESM_URL';
        }
      }
    }, this));

    var next = function(url){
      var prefix = 'http://api.awe.sm/url/share?v=3&key=' + self.params.awesm.key + '&campaign=' + self.params.awesm.campaign + '&tool=' + self.params.awesm.tool + '&url=' + encodeURIComponent(url || self.params.url);
      var share = {
        twitter: prefix + '&channel=twitter&destination=' + encodeURIComponent('https://twitter.com/intent/tweet?text=' + encodeURIComponent(self.params.twitter.text || self.params.text)),
        facebook: prefix + '&channel=facebook-send&destination=' + encodeURIComponent('https://facebook.com/dialog/feed?app_id=' + self.params.facebook.appId + '&redirect_uri=' + encodeURIComponent(self.params.facebook.redirect || self.params.url || location.href) + '&name='+ encodeURIComponent(self.params.facebook.title || '') + '&description=' + encodeURIComponent(self.params.facebook.text || self.params.text) + '&caption=' + encodeURIComponent(self.params.caption) + '&picture=' + self.params.asset + '&link=AWESM_URL'),
        gplus: prefix + '&channel=gplus&destination=https://plus.google.com/share?url=AWESM_URL', // .jpg
        pinterest: prefix + '&channel=pinterest&destination=' + encodeURIComponent('http://pinterest.com/pin/create/button?description=' + encodeURIComponent(self.params.pinterest.text || self.params.text) + '&media=' + self.params.asset + '&url=AWESM_URL'),
        tumblr: prefix + '&channel=tumblr&destination=' + encodeURIComponent('http://tumblr.com/share/photo?caption=' + encodeURIComponent(self.params.tumblr.text || self.params.text) + '&source=' + encodeURIComponent(self.params.asset) + '&clickthru=AWESM_URL')
      };

      if(callback) callback(share);
      return share;
    };

    if(this.params.bitly && this.params.bitly.apiKey && this.params.bitly.login) {
      this._shorten(this.params.url || location.href, next);
    } else return next();
  };

  return Share;
})();
