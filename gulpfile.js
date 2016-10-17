var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browsersync = require('browser-sync');
var plumber = require('gulp-plumber');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var reload = browsersync.reload;
var eslint = require('gulp-eslint');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var notify = require('gulp-notify');
//sass task

var plumberErrorHandler={
    errorHandler: notify.onError({
        title: "gulp",
        message: "Error: <%= error.message=%>" //will be notified if something is wrong. 
    })
}
//SASS
gulp.task('sass', function() {
   gulp.src('./sass/style.scss')
      .pipe(sass())
      .pipe(plumber(plumberErrorHandler))
      .pipe(autoprefixer({
         browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./build/css'))
      .pipe(cssnano())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('./build/css'));
});


gulp.task('eslint', function() {
  return gulp.src('js/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  // Brick on failure to be super strict
  .pipe(eslint.failOnError());
});
 
gulp.task('default', ['eslint'], function () {
    console.log('heeey')
});
 

gulp.task('plumba', function (){
gulp.src('./src/*.ext')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('./dist'))

});
 
 gulp.task('serve', function(){ //runs a take that we named default
   gulp.src('./js/*.js') //what files do we want to be absorbed by gulp
      .pipe(uglify()) // enable uglify, minifies... pipe chains things together
      .pipe(rename({ extname: '.min.js' })) //  give new name to uglify file to .js
      .pipe(gulp.dest('./build/js')) // location to put results? build file.
 });
// Save a reference to the `reload` method

// Watch scss AND html files, doing different things with each.
gulp.task('browsersync', function () {
    // Serve files from the root of this project
    browsersync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(["build/css/*.css", "build/js/*.js"]).on("change", reload);
});

gulp.task('watch', function() {
   gulp.watch('js/*.js', ['scripts', 'plumba', 'sass',]);
   gulp.watch('sass/*.scss', ['sass'])
});

gulp.task('watch', function() {
   gulp.watch('js/*.js', ['serve', 'eslint']);
   gulp.watch('sass/*.scss', ['sass'])
});

gulp.task('default', [ 'browsersync', 'serve', 'watch', 'sass', 'eslint']);




