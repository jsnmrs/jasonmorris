module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      beforeconcat: ['js/libs/instagram.js', 'Gruntfile.js']
    },

    uglify: {
      plugins: {
        src: [
          'js/libs/jquery-1.10.2.js',
          'js/libs/jquery.fittext.js',
          'js/libs/instagram.js'
        ],
        dest: 'js/scripts.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/style.css': 'css/scss/style.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 3 version', 'ie 8', 'ie 9']
      },
      target: {
        src: 'css/style.css'
      },
    },

    copy: {
      js: {
        src: 'js/scripts.js',
        dest: '_site/js/scripts.js',
      },
      css: {
        src: 'css/style.css',
        dest: '_site/css/style.css',
      },
    },

    open: {
      dev: {
        path: 'http://127.0.0.1:4000/'
      }
    },

    jekyll: {
      src: ".",
      dest: "_site",
      options: {
        bundleExec: true,
        safe: true,
        drafts: true
      }
    },

    watch: {
      scripts: {
        files: ['js/libs/*.js'],
        tasks: ['jshint', 'uglify', 'copy:js']
      },
      css: {
        files: ['css/scss/*.scss'],
        tasks: ['sass', 'autoprefixer', 'copy:css']
      },
      jekyll: {
        files: ['*.html', '**/*.html', '**/*.md'],
        tasks: ['jekyll']
      }
    },

    connect: {
      server: {
        options: {
          port: 4000,
          base: './_site/'
        }
      }
    },

    devUpdate: {
      main: {
        options: {
          updateType: 'prompt',
          reportUpdated: false,
          semver: false,
          packages: {
            devDependencies: true,
            dependencies: false
          },
          packageJson: null
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'autoprefixer', 'jekyll']);
  grunt.registerTask('layout', ['jshint', 'uglify', 'sass', 'autoprefixer', 'copy']);
  grunt.registerTask('work', ['layout', 'connect', 'open', 'watch']);
  grunt.registerTask('blog', ['jekyll', 'watch']);
  grunt.registerTask('update', ['devUpdate']);

};