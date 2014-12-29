var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var TEST_SRC_FILES = 'test/**/*.js';
var LIB_SRC_FILES = 'lib/**/*.js';

gulp.task('default', ['lint', 'jscs', 'mocha']);

gulp.task('mocha', function() {
  return gulp.src(TEST_SRC_FILES, { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', gutil.log);
});

gulp.task('watch', function() {
  gulp.watch([TEST_SRC_FILES, LIB_SRC_FILES], ['lint', 'jscs', 'mocha']);
});

gulp.task('lint', function() {
  gulp.src(LIB_SRC_FILES)
    .pipe(jshint())
    .pipe(jshint.reporter('cool-reporter'))
    .pipe(jshint.reporter('fail'))
    .on('error', gutil.log);
});

gulp.task('jscs', function() {
  gulp.src(LIB_SRC_FILES)
    .pipe(jscs())
    .on('error', function(error) { gutil.log(error.message); });
});
