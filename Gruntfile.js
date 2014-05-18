module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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
      css: {
        files: ['css/scss/*.scss'],
        tasks: ['sass', 'autoprefixer', 'copy:css']
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

  grunt.registerTask('default', ['sass', 'autoprefixer', 'jekyll']);
  grunt.registerTask('layout', ['sass', 'autoprefixer', 'copy']);
  grunt.registerTask('work', ['layout', 'connect', 'watch']);
  grunt.registerTask('blog', ['jekyll', 'connect', 'watch']);
  grunt.registerTask('update', ['devUpdate']);

};