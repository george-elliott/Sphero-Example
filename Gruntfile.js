var ejs = require('ejs'),
    _ = require('lodash');

module.exports = function(grunt) {
  var ENV = process.env.ENV || 'staging';
  var display = require('./display.json');
  display = _.extend(display, display[ENV] || {}, {
    env: ENV,
    version: require('./package.json').version,
    name: require('./package.json').name
  });
  
  grunt.file.mkdir('build');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    
    concat: {
      build: {
        src: ['lib/*.js', 'build/ejs_templates.js', 'build/handlebars_templates.js', 'scripts/<%= pkg.name %>.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    
    ejs: {
      display: {
        options: _.extend({}, display, {
          '_': _,
          version: -1 < process.argv.indexOf('release') ? display.version : 'latest'
        }),
        src: 'scripts/.display.js',
        dest: 'build/display.js'
      }
    },
    
    compile: {
      options: {
        include: ['scripts', 'build']
      },
      
      scripts: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    
    copy: {
      assets: {
        files: (function(){
          var files = [];
          
          grunt.file.glob.sync('assets/**/*').forEach(function(file){
            files.push({
              src: file,
              dest: file.replace('assets', 'build')
            });
          });
          
          return files;
        })()
      },
      
      lib: {
        files: (function(){
          var files = [];
          
          grunt.file.glob.sync('lib/**/*').forEach(function(file){
            files.push({
              src: file,
              dest: file.replace('lib', 'build/lib')
            });
          });
          
          return files;
        })()
      }
    },
    
    compass: {
      build: {
        options: {
          sassDir: 'stylesheets',
          specify: 'stylesheets/<%= pkg.name %>.scss',
          cssDir: 'build',
          imagesDir: 'assets/images',
          noLineComments: false,
          require: 'breakpoint'
        }
      }
    },
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    
    jst: {
      options: {
        processName: function(filename) {
          return filename.replace('templates/', '').replace('.ejs', '');
        }
      },
      
      build: {
        files: {
          'build/ejs_templates.js': ['templates/*.ejs', 'templates/**/*.ejs']
        }
      }
    },
    
    handlebars: {
      options: {
        processName: function(filename) {
          return filename.replace('templates/', '').replace(/\.handlebars|\.hbs/, '');
        },
        compilerOptions: {
          knownHelpersOnly: false
        }
      },
      
      build: {
        files: {
          'build/handlebars_templates.js': ['templates/*.hbs', 'templates/*.handlebars', 'templates/**/*.hbs', 'templates/**/*.handlebars']
        }
      }
    },
    
    watch: {
      scripts: {
        files: ['scripts/**'],
        tasks: ['jst', 'handlebars', 'concat', 'ejs', 'compile', 'uglify', 'clean', 'updateMtime']
      },
      
      templates: {
        files: ['templates/**.ejs', 'templates/**/*.ejs', 'templates/**.handlebars', 'templates/**.hbs', 'templates/**/*.hbs', 'templates/**/*.handlebars'],
        tasks: ['jst', 'handlebars', 'concat', 'ejs', 'compile', 'uglify', 'clean', 'updateMtime']
      },
      
      assets: {
        files: ['assets/**'],
        tasks: ['copy:assets']
      },
      
      stylesheets: {
        files: ['stylesheets/**'],
        tasks: ['compass', 'clean', 'updateMtime']
      },
      
      lib: {
        files: ['lib/**/*'],
        tasks: ['copy:lib', 'jst', 'handlebars', 'concat', 'ejs', 'compile', 'uglify', 'clean', 'updateMtime']
      }
    },
    
    updateMtime: {
      scripts: {
        files: 'build/*.js'
      },
      
      stylesheets: {
        files: 'build/*.css'
      }
    },
    
    deploy: {
      latest: {
        files: 'build/**/*',
        env: display.env,
        version: 'latest'
      },
      
      current: {
        files: 'build/**/*',
        env: display.env,
        version: display.version
      }
    },
    
    bump: {
      options: {
        tagName: '%VERSION%',
        pushTo: 'origin'
      }
    },
    
    clean: {
      templates: ['build/ejs_templates.js', 'build/handlebars_templates.js'],
      scripts: ['build/embed.js.*', 'build/index.html.*'],
      build: ['build/<%= pkg.name %>*-*', 'build/display*-*']
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-baker');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-ejs');
  
  grunt.registerTask('default', ['jst', 'handlebars', 'concat', 'ejs', 'compile', 'compass', 'copy', 'uglify', 'clean', 'updateMtime']);
  grunt.registerTask('release', ['default', 'deploy:current', 'bump-commit', 'bump-only']);
};