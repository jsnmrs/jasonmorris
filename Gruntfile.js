module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      beforeconcat: ['js/lib/insta.js', '_test/jasonmorris.test.js']
    },

    uglify: {
      scripts: {
        files: {
          'js/scripts.js': ['js/vendor/jquery.js', 'js/lib/insta.js']
        }
      },
      picturefill: {
        files: {
          'js/picturefill.js': ['js/vendor/picturefill.js']
        }
      }
    },

    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['jshint', 'uglify']
      }
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
          'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48' // navigation section warning
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

  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('work', ['default', 'watch']);
  grunt.registerTask('audit-html', ['htmllint']);
  grunt.registerTask('audit-a11y', ['accessibility']);
  grunt.registerTask('update', ['devUpdate']);

};
