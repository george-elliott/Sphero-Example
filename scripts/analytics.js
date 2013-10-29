if(Display.analytics.apiKey) {
  window.analytics = [];

  var methods = [
    'identify', 'track', 'trackLink', 'trackForm', 'trackClick', 'trackSubmit',
    'page', 'pageview', 'ab', 'alias', 'ready', 'group'
  ];

  var factory = function (method) {
    return function () {
      analytics.push([method].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };

  for (var i = 0; i < methods.length; i++) {
    analytics[methods[i]] = factory(methods[i]);
  }

  Chute.require('//d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/' + Display.analytics.apiKey + '/analytics.min.js', _.bind(Backbone.history.start, Backbone.history));
} else {
  window.analytics = { track: $.noop };
  Backbone.history.start();
}