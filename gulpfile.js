var gulp          = require('gulp');
var autoprefixer  = require('autoprefixer');
var axe           = require('gulp-axe-webdriver');
var browserSync   = require('browser-sync');
var cp            = require('child_process');
var htmlhint      = require("gulp-htmlhint");
var imagemin      = require('gulp-imagemin');
var jshint        = require('gulp-jshint');
var merge         = require('merge-stream');
var newer         = require('gulp-newer');
var postcss       = require('gulp-postcss');
var sass          = require('gulp-sass');
var sassLint      = require('gulp-sass-lint');
var uglify        = require('gulp-uglify');
var webpagetest   = require('gulp-webpagetest');


gulp.task('default', ['browser-sync', 'watch']);
gulp.task('build', ['images', 'js', 'jekyll-build']);
gulp.task('css', ['sass', 'sasslint']);
gulp.task('lint', ['sasslint', 'htmllint', 'jshint', 'axe', 'webpagetest']);


gulp.task('watch', function () {
    gulp.watch('img/*', ['images']);
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('_scss/**/*.scss', ['jekyll-rebuild']);
    gulp.watch(['index.html', '_includes/*', '_layouts/*.html', '*.md', '_posts/*', '_sass/**/*.scss'], ['jekyll-rebuild']);
});


gulp.task('jekyll-build', ['css'], function (done) {
  browserSync.notify('Building Jekyll');
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config', '_config.yml,_local-config.yml'], {stdio: 'inherit'})
    .on('close', done);
});


gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


gulp.task('browser-sync', ['build'], function() {
  browserSync({
    server: {baseDir: '_site'},
    host: '127.0.0.1',
    port: 4000
  });
});


gulp.task('images', function() {
  return gulp.src(['img/*.{png,svg,jpg,gif}'])
    .pipe(newer('img'))
    .pipe(imagemin([
    	imagemin.jpegtran({progressive: true}),
    	imagemin.optipng({optimizationLevel: 5}),
    	imagemin.svgo({plugins: [{removeViewBox: false}]})
    ]))
    .pipe(gulp.dest('img'))
    .pipe(gulp.dest('_site/img'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('js', function() {
  var options = {
    mangle : true,
    compress : true
  };

  var picturefill = gulp.src(['js/vendor/picturefill.js'])
    .pipe(uglify(options))
    .pipe(gulp.dest('_site/js/'))
    .pipe(gulp.dest('js/'));

  var sw = gulp.src(['js/lib/sw.js'])
    .pipe(uglify(options))
    .pipe(gulp.dest('_site/'))
    .pipe(gulp.dest('./'));

  return merge(picturefill, sw)
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('sass', function () {
  return gulp.src('_scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('_includes/'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('sasslint', function () {
  return gulp.src('_scss/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});


gulp.task('htmllint', function() {
  return gulp.src(['_site/**/*.html'])
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter());
});


gulp.task('jshint', function() {
  return gulp.src(['_js/lib/*', 'gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('axe', function(done) {
  var options = {
    urls: ['_site/**/*.html'],
    browser: 'phantomjs',
    a11yCheckOptions: ['wcag2aa', 'wcag2a', 'best-practice'],
    showOnlyViolations: false
  };
  return axe(options, done);
});


gulp.task('webpagetest', webpagetest({
  url: 'https://jasonmorris.com',
  key: 'A.e04d20f893fadb3ae5c4f06494a457c8',
  location: 'Dulles:Chrome',
  firstViewOnly: true,
  budget: {
    SpeedIndex: 1000,
    visualComplete: 1000
  },
  callback: function() {
    console.log('WPT test done !');
  }
}));
