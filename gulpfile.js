'use strict';

var browserify  = require('browserify');
var connect     = require('connect');
var del         = require('del');
var exec        = require('child_process').exec;
var gulp        = require('gulp');
var pkg         = require('./package.json');
var serveStatic = require('serve-static');
var source      = require('vinyl-source-stream');

var $ = require('gulp-load-plugins')();

var path = {
  'build'      : 'build/',
  'html'       : 'index.html',
  'libs'       : Object.keys(pkg.dependencies),
  'main'       : 'app.jsx',
  'scripts'    : 'scripts/**/*.{jsx,js}',
  'styles'     : 'styles/**/*.{less,css}',
};

function say(msg) {
  exec('say -v Fred "' + msg + '"');
}

function err(e) {
  $.util.log(e.message);
  say('Build failed');

  // jshint validthis: true
  this.emit('end');
}

gulp.task('build-lib', function () {
  var bundle = browserify({
      cache        : {},
      debug        : true,
      fullPaths    : true,
      packageCache : {}
    })
    .require(path.libs)
    .bundle()
    .on('error', err);

  return bundle
    .pipe(source('js/lib.js'))
    .pipe(gulp.dest(path.build));
});

gulp.task('build-app', function () {
  var bundle = browserify(path.main, {
      debug      : true,
      paths      : ['./scripts'],
      standalone : 'CityWeather'
    })
    .external(path.libs)
    .transform('reactify')
    .bundle()
    .on('error', err);

  return bundle.pipe(source('js/app.js'))
    .pipe(gulp.dest(path.build));
});

gulp.task('styles', function () {
  var filter = $.filter(['**/*.less', '**/!_*.less']);

  return gulp.src(path.styles)
    .pipe(filter)
    .pipe($.less())
    .on('error', err)
    .pipe($.concat('screen.css'))
    .pipe(filter.restore())
    .pipe($.filter('**/*.css'))
    .pipe(gulp.dest(path.build + 'css'));
});

gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(gulp.dest(path.build));
});

gulp.task('build', ['build-lib', 'build-app', 'styles', 'html']);

gulp.task('clean', function () {
  del([path.build], cb);
});

gulp.task('serve', function () {
  connect()
    .use(serveStatic(path.build))
    .listen(8000);

  $.util.log('Server listening on http://localhost:' + 8000);

  $.livereload.listen({ port: 35729 });

  gulp.watch(path.build + '/**/*')
    .on('change', function (path) {
      $.livereload.changed(path);
    });
});

gulp.task('watch', ['build', 'serve'], function () {
  gulp.watch('./package.json', ['build-lib']);
  gulp.watch(path.scripts, ['build-app']);
  gulp.watch(path.styles, ['styles']);
  gulp.watch(path.html, ['html']);
});

gulp.task('default', ['build']);
