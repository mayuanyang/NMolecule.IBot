var gulp = require('gulp');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var open = require('gulp-open');
var traceur = require('gulp-traceur');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var browserify = require('browserify');
var source   = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});
var rename = require("gulp-rename");

gulp.task('clean', function(){
	return gulp.src('app/dist/', {read: false})
        .pipe(clean());
});

gulp.task('image', [], function (done) {

    return gulp.src([
        'app/assets/images/*.*'
    ])
    .pipe(gulp.dest('app/dist/assets/images'));
    //done('ok');
});

gulp.task('font', ['image'], function (done) {
    
    return gulp.src([
        'app/bower_components/bootstrap/dist/fonts/*.*'
    ])
    .pipe(gulp.dest('app/dist/assets/fonts'));
    //done('ok');
});

gulp.task('html', ['font'], function (done) {

    gulp.src([
        'index.html'
    ])
    .pipe(gulp.dest('app/dist/'));


    gulp.src([
        'app/views/*.html'
    ])
    .pipe(gulp.dest('app/dist/views'));

    gulp.src([
        'app/views/admin/*.html'
    ])
    .pipe(gulp.dest('app/dist/views/admin'));

    return gulp.src([
        'app/views/shared/*.html'
    ])
    .pipe(gulp.dest('app/dist/views/shared'));
    //done('ok');
});

gulp.task('style', ['html'], function (done) {
    gulp.src([
        'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'app/bower_components/angular-bootstrap-toggle-switch/style/bootstrap3/angular-toggle-switch-bootstrap-3.css',
        'app/bower_components/angular-chart.js/dist/angular-chart.css',
        'app/bower_components/metisMenu/dist/metisMenu.min.css',
        'app/bower_components/angular-busy/dist/angular-busy.min.css'
    ])
    .pipe(gulp.dest('app/dist/assets/styles'));

    return gulp.src([
        'app/assets/styles/*.css'
    ])
    .pipe(gulp.dest('app/dist/assets/styles'));
});

gulp.task('localscript', ['style'], function (done) {
    gulp.src([
        'app/appSettings.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/Chart.js/Chart.js',
        'app/bower_components/angular-chart.js/dist/angular-chart.js',
        'app/bower_components/jquery/dist/jquery.min.js',
        'app/bower_components/bootstrap/dist/js/bootstrap.min.js'
        
    ])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('app/dist'));

    return gulp.src([
        'app/assets/scripts/*.js'
    ])
    .pipe(gulp.dest('app/dist/assets/scripts'));
});


gulp.task('traceur:runtime', ['localscript'], function(done) {
  return gulp.src(traceur.RUNTIME_PATH)
    .pipe(gulp.dest('app/dist'));
	done('ok');
});


gulp.task('traceur:transpile', ['traceur:runtime'], function (callback) {
    
    
    return gulp.src([
          
          'app/controllers/*.js',
          'app/app.js',
		  'app/services/*.js',
          'app/directives/*.js',
          'app/factories/*.js',
          'app/bower_components/angular-busy/dist/angular-busy.js',
          'app/bower_components/angular-scroll/angular-scroll.js',
          'app/bower_components/angular-ui-router/release/angular-ui-router.js',
          'app/bower_components/angular-bootstrap-toggle-switch/angular-toggle-switch.js',
          'app/bower_components/metisMenu/dist/metisMenu.min.js',
          'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
          
        ])
		.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(traceur({ blockBinding: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('app/dist'));
	callback('ok');
});



gulp.task('browserify', ['traceur:transpile'],  function (done) {
    
	return browserify({ entries: ['app/dist/app.js'] })
        .bundle()
		.pipe(source('app.bundled.js'))
		.pipe(gulp.dest('app/dist/build'));
	done('err');
});


gulp.task('uglify', ['browserify'], function(){
	gulp.src('app/dist/build/*.js')
	//.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(uglify())
	//.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('app/dist/build'));
});


gulp.task('connect', ['uglify'], function () {
    // Watch any js file change and execute the scripts task
    gulp.watch(['app/app.js',
        'app/controllers/*.js',
        'app/services/*.js',
        'app/factories/*.js',
        'app/directives/*.js',
        'app/views/**/*.html'], ['uglify']);

  connect.server({
	root: 'app/dist',
    livereload: true,
	port: 9091
  });
  //open("http://localhost:9091", 'chrome');

  return gulp.src(__filename)
      .pipe(open({ uri: 'http://localhost:9091' }));
});

gulp.task('watch', ['connect'], function () {
    
});

gulp.task('setting-prod', ['uglify'], function() {
    return gulp.src('app/appSettings.prod.js')
		.pipe(rename("appSettings.js"))
		.pipe(gulp.dest('app/dist'));
});

gulp.task('default', ['watch']);
gulp.task('deploy', ['setting-prod']);
