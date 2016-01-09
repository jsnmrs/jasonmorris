module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      beforeconcat: ['_test/jasonmorris.test.js']
    },

    uglify: {
      html5shiv: {
        files: {
          'js/html5shiv.js': ['js/vendor/html5shiv.js']
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

    shell: {
      build: {
        command: 'bundle exec jekyll build'
      },
      linkcheck: {
        command: "htmlproof ./_site --alt-ignore '/.*/'"
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

    scsslint: {
      all: [
        '_sass/*.scss',
      ],
      options: {
        bundleExec: true,
        config: '.scss-lint.yml',
        colorizeOutput: true
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
          'WCAG2AA.Principle1.Guideline1_1.1_1_1.H67.2', // empty alt tag warning
          'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48', // navigation section warning
          'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Abs' // abs pos contrast warning
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
  grunt.registerTask('audit-scss', ['scsslint']);
  grunt.registerTask('audit-a11y', ['accessibility']);
  grunt.registerTask('build-test', ['shell:build', 'htmllint', 'accessibility', 'scsslint', 'shell:linkcheck']);
  grunt.registerTask('update', ['devUpdate']);

};
