module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      plugins: {
        src: ['js/vendor/jquery.js', 'js/vendor/fittext.js', 'js/vendor/fitvids.js'],
        dest: 'js/scripts.js'
      },
      shiv: {
        src: ['js/vendor/html5shiv.js'],
        dest: 'js/html5shiv.js'
      },
      picturefill: {
        src: ['js/vendor/picturefill.js'],
        dest: 'js/picturefill.js'
      }
    },

    scsslint: {
      allFiles: [
        'css/scss/*.scss',
      ],
      options: {
        bundleExec: true,
        config: '.scss-lint.yml',
        reporterOutput: null,
        colorizeOutput: true
      },
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: true
        },
        files: {
          'css/style.css': 'css/scss/style.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 3 version', 'ie 8', 'ie 9'],
        map: true
      },
      target: {
        src: 'css/style.css'
      },
    },

    copy: {
      js: {
        expand: true,
        src: ['js/scripts/*'],
        dest: '_site/js/scripts/',
        filter: 'isFile'
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
        drafts: true
      }
    },

    watch: {
      scripts: {
        files: ['js/vendor/*.js'],
        tasks: ['uglify', 'copy:js']
      },
      css: {
        files: ['css/scss/*.scss'],
        tasks: ['scsslint', 'sass', 'autoprefixer', 'copy:css']
      },
      jekyll: {
        files: ['*.html',
                '_includes/*.html',
                '_layouts/*.html',
                '_drafts/*.html',
                '_drafts/*.md',
                '_posts/*.html',
                '_posts/*.md'],
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
  require('time-grunt')(grunt);

  grunt.registerTask('default', ['uglify', 'scsslint', 'sass', 'autoprefixer', 'jekyll']);
  grunt.registerTask('layout', ['uglify', 'scsslint', 'sass', 'autoprefixer', 'copy']);
  grunt.registerTask('work', ['jekyll', 'layout', 'connect', 'open', 'watch']);
  grunt.registerTask('update', ['devUpdate']);

};