var gulp          = require('gulp');
var axe           = require('gulp-axe-webdriver');
var browserSync   = require('browser-sync');
var cp            = require('child_process');
var htmlhint      = require("gulp-htmlhint");
var imagemin      = require('gulp-imagemin');
var jshint        = require('gulp-jshint');
var merge         = require('merge-stream');
var newer         = require('gulp-newer');
var psi           = require('psi');
var scsslint      = require('gulp-scss-lint');
var uglify        = require('gulp-uglify');


// Default task - build, launch BrowserSync, and watch files
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('build', ['images', 'js', 'jekyll-build']);
gulp.task('lint', ['scsslint', 'htmllint', 'jshint', 'axe']);


// Watch tasks - images, JS, SCSS, HTML/markdown
gulp.task('watch', function () {
    gulp.watch('img/*', ['images']);
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '*.md', '_posts/*'], ['jekyll-rebuild']);
});


// Jekyll build - using GitHub Pages spec via bundle exec
gulp.task('jekyll-build', function (done) {
  browserSync.notify('Building Jekyll');
  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
    .on('close', done);
});


// Jekyll rebuild - hook for Jekyll build after file changes
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


// Local server - starts after initial build tasks finish
gulp.task('browser-sync', ['build'], function() {
  browserSync({
    server: {baseDir: '_site'},
    host: '127.0.0.1',
    port: 4000
  });
});


// Image optimization - JPG, GIF, PNG, SVG
// Writes to base image directory and _site image directory (for immediate refresh)
// Only runs on images that are newer than the versions in public/img/
gulp.task('images', function() {
  return gulp.src('img/*')
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


// Concatenate, uglify JS files
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


// SCSS linting - using scss_lint gem via bundle exec
gulp.task('scsslint', function() {
  return gulp.src(['_sass/**/*.scss'])
    .pipe(scsslint({bundleExec: true}))
    .pipe(scsslint.failReporter());
});


// HTML linting
gulp.task('htmllint', function() {
  return gulp.src(['_site/**/*.html'])
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter());
});


// JS linting
gulp.task('jshint', function() {
  return gulp.src(['_js/lib/*', 'gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


// Accessibility tests using aXe
gulp.task('axe', function(done) {
  var options = {
    urls: ['_site/**/*.html'],
    browser: 'phantomjs',
    a11yCheckOptions: ['wcag2aa', 'wcag2a', 'best-practice'],
    showOnlyViolations: false
  };
  return axe(options, done);
});


// Google Pagespeed Insights
gulp.task('mobile', function () {
    return psi(site, {
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});

gulp.task('desktop', function () {
    return psi(site, {
        nokey: 'true',
        strategy: 'desktop',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});
