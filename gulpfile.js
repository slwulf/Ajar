var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var run = require('run-sequence');
var argv = require('yargs').argv;

var srcFile = 'index.js';

// output src to dist
gulp.task('js', function() {
  return gulp.src(srcFile)
    .pipe(rename({ basename: 'ajar' }))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dist/'))
});

// test stuff
gulp.task('test', function() {
  return gulp.src('spec/*.js')
    .pipe(mocha({ reporter: argv.reporter || 'nyan' }))
});

// compile and run tests
gulp.task('build', function() {
  run('js', 'test')
});

// watch it!
gulp.task('watch', function() {
  gulp.watch('spec/*.js', ['build']);
  gulp.watch(srcFile, ['build']);
});

gulp.task('default', ['build', 'watch']);
