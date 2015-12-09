module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      beforeconcat: ['js/insta.js']
    },

    uglify: {
      plugins: {
        files: {
          //'js/scripts.js': ['js/insta.js']
        }
      }
    },

    imagemin: {
      main: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'img/'
        }]
      }
    },

    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['jshint']
      }
    },

    purifycss: {
      options: {},
      target: {
        src: ['_site/**/*.html', '_site/js/*.js'],
        css: ['_site/css/*.css'],
        dest: 'tmp/purestyles.css'
      },
    },

    htmllint: {
      all: {
        options: {
          ignore: ['The “frameborder” attribute on the “iframe” element is obsolete. Use CSS instead.',
          'The “scrolling” attribute on the “iframe” element is obsolete. Use CSS instead.']
        },
        src: "_site/**/*.html"
      }
    },

    accessibility: {
      options : {
        accessibilityLevel: 'WCAG2AA',
        reportLevels: {
          notice: false,
          warning: true,
          error: true
        },
        ignore : [
          'WCAG2A.Principle1.Guideline1_1.1_1_1.H67.2', // empty alt tag warning
          ]
      },
      test : {
        src: ['_site/**/*.html']
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

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('images', ['imagemin']);
  grunt.registerTask('work', ['default', 'watch']);
  grunt.registerTask('audit-css', ['purifycss']);
  grunt.registerTask('audit-html', ['htmllint']);
  grunt.registerTask('audit-a11y', ['accessibility']);
  grunt.registerTask('update', ['devUpdate']);

};
