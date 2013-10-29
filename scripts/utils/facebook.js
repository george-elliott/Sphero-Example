var fb = {
  isInit: false,
  init: function() {
    if(Display.facebook.appId) {
      window.fbAsyncInit = _.bind(function() {
        // init the FB JS SDK
        FB.init({
          appId      : Display.facebook.appId,               // App ID from the app dashboard
          status     : true,                                 // Check Facebook Login status
          xfbml      : true                                 // Look for social plugins on the page
        });

        // Additional initialization code such as adding Event Listeners goes here
        this.isInit = true;
      }, this);
      // Load the SDK asynchronously
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  },
  resize: function(height) {
    if(!this.isInit) return;
    if(typeof FB !== 'undefined' && FB !== null)  {
      if(height) {
        FB.Canvas.setSize({height: height});
      } else {
        FB.Canvas.setSize();
      }
    } else {
      setTimeout(this.resize(height), 200);
    }
  },
  autoGrow: function() {
    if(!this.isInit) return;
    if(typeof FB !== 'undefined' && FB !== null)  {
      FB.Canvas.setAutoGrow(300);
    } else {
      setTimeout(this.autoGrow, 300);
    }
  },
  getOffset: function(callback) {
    if(!this.isInit) return;
    if(typeof FB !== 'undefined' && FB !== null)  {
      FB.Canvas.getPageInfo(
          function (info) {
            if(typeof(callback) != 'undefined') {
              callback(info);
            }
          }
      );
    } else {
      setTimeout(this.getOffset(callback), 500);
    }
  },
  scrollTo: function(x, y) {
    if(!this.isInit) return;
    if(typeof FB !== 'undefined' && FB !== null)  {
      FB.Canvas.scrollTo(x,y);
    }
  }
}