var express = require('express'),
    exec = require('child_process').exec,
    fs = require('fs');

var displayName = require('./package.json').name;

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(function(req, res, next){
  if(-1 < req.url.indexOf(displayName + '.css')) {
    exec('compass compile stylesheets/' + displayName + '.scss --sass-dir stylesheets --css-dir .sass-cache -r breakpoint', function(){
      fs.readFile('.sass-cache/' + displayName + '.css', function(err, buffer){
        res.end(buffer);
      });
    });
  } else next();
});
app.use(express.static('./build'));
app.use(function(req, res, next){
  res.with = function(file) {
    fs.readFile(file, function(err, buffer){
      res.end(buffer);
    });
  };
  
  next();
});

if (process.env.NODE_ENV === 'production') {
  var homepage = function(req, res) {
    fs.stat('./index.html', function(err){
      if(! err) return res.with('./index.html');
      res.end(404);
    });    
  }
  app.get('/*', homepage);
  app.post('/*', homepage);  // for FB tab
} else {
  app.get('/', function(req, res){
    fs.stat('./test/index.html', function(err){
      if(! err) return res.with('./test/index.html');      
      res.end(404);
    });
  });
}

app.listen(app.get('port'));
console.log('Server listening at port ' + app.get('port'));