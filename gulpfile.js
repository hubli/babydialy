var gulp = require('gulp');

var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
	scripts: 'src/js/**/*.js',
	images : 'src/img/**/*',
	sasses : 'src/sass/**/*.scss' 
}

gulp.task('clean', function(cb) {
	del(['release'], cb)
})

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(jshint())
		//.pipe(uglify())
		.on('error', function(error) {
			console.log(error);
			this.emit('end');
		})/*
		.pipe(concat('babydaily.js'))*/
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('release/js'))		
})

gulp.task('imagemin', function() {
	return gulp.src(paths.images)
		.pipe(imagemin({optimiazationLevel: 5}))
		.on('error', function(error) {
			console.log(error);
			this.emit('end');
		})
		.pipe(gulp.dest('release/img'));
});

gulp.task('compass', function() {
	return gulp.src(paths.sasses)
		.pipe(compass({
			config_file: './config.rb',
			css: './src/stylesheets',
			sass: './src/sass'
		}))		
		.pipe(minifyCSS())
		.pipe(gulp.dest('release/css'));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.imagemin, ['images']);
	gulp.watch(paths.sasses, ['compass']);
})


gulp.task('default', ['watch', 'scripts', 'imagemin', 'compass']);