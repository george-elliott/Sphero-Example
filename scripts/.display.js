var Display = {
  env: '<%= env %>',
  version: '<%= version %>',
  container: '<%= container %>',
  
  albums: {
    <%- _.transform(albums, function(accumulator, shortcut, album) { accumulator.push('"' + album + '": "' + shortcut + '"'); }, []).join(",\n\t\t") %>
  },
  
  analytics: {
    apiKey: '<%= analytics.apiKey %>'
  },
  
  collections: {},
  
  mediachooser: {
    clientId: '<%= mediachooser.clientId %>',
    album: '<%= mediachooser.album %>'
  },

  facebook: {
    appId: '<%= facebook.appId %>'
  },
  
  dependencies: [
    <%- _.transform(dependencies, function(accumulator, dependency){ accumulator.push("'" + dependency + "'"); }, []).join(",\n\t\t") %>
  ],
  
  ready: function(done) {
    Chute.ready(function(){
      if(Display.mediachooser) {
        Chute.setApp(Display.mediachooser.clientId);
      }
      
      _.each(Display.albums, function(shortcut, name){
        Display.collections[name] = new Chute.API.Assets(null, { album: shortcut, per_page: 20 });
      });
      
      Chute.Display.requires(Display.dependencies, done);
    });
  }
};

var BASE = Display.base = /localhost/.test(location.href) ? '' : '//static.getchute.com/displays/<%= name %>/production/<%= version %>';