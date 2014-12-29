var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');

var TEST_SRC_FILES = ['test/**/*.js'];
var LIB_SRC_FILES = ['lib/**'];

gulp.task('default', ['mocha']);

gulp.task('mocha', ['lint'], function() {
  return gulp.src(TEST_SRC_FILES, { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
  gulp.watch([].concat(TEST_SRC_FILES).concat(LIB_SRC_FILES), ['mocha']);
});

gulp.task('lint', function() {
  gulp.src(LIB_SRC_FILES)
    .pipe(jshint())
    .pipe(jshint.reporter('cool-reporter'))
    .pipe(jshint.reporter('default'), { verbose: true });
});
