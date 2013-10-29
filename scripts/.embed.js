(function(){
  function load(url, attrs, done) {
    var el;
    
    if(typeof attrs === 'function') {
      done = attrs;
      attrs = {};
    }
    
    if(/\.js$/.test(url)) {
      el = document.createElement('script');
      el.src = url;
      el.type = 'text/javascript';
    } else {
      el = document.createElement('link');
      el.href = url;
      el.type = 'text/css';
      el.rel = 'stylesheet';
    }
    
    for(var key in attrs) {
      if(attrs.hasOwnProperty(key)) el.setAttribute(key, attrs[key]);
    }
    
    if(/\.css$/.test(url)) {
      if(done) done();
    } else {
      var finished = false;

      el.onload = el.onreadystatechange = function(){
        if(! finished && (! this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState)) {
          finished = true;
          el.onload = el.onreadystatechange = null;
          if(done) done();
        }
      };
    }
    
    document.getElementsByTagName('head')[0].appendChild(el);
  }
  
  var noConflict;
  
  function loadDisplay() {
    load('//static.getchute.com/chutejs/v1/chute.min.js', (function(){
      var attrs = {
        'data-load': 'display'
      };
      
      if(noConflict) attrs['data-no-conflict'] = 'true';
      
      return attrs;
    })(), function(){
      load('//static.getchute.com/<%= url %>/<%= script %>');
      load('//static.getchute.com/<%= url %>/<%= stylesheet %>');
    });
  }
  
  if(! window.$) {
    load('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', loadDisplay);
  } else if(!window.jQuery || (parseFloat(jQuery.fn.jquery) < 1.7 && jQuery.fn.jquery.substr(1).length !== 5)) {
    noConflict = true;
    load('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', loadDisplay);
  } else loadDisplay();
})();