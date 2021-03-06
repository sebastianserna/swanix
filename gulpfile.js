//-----------------------------------------------------
// SWANIX UI
// by Sebastian Serna
// 2015 - 2018
//-----------------------------------------------------

'use strict';

var gulp = require('gulp' ),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    twig = require('gulp-twig'),
    browserSync = require('browser-sync');

//-----------------------------------------------------
// Global variables
//-----------------------------------------------------

// Twig to HTML
var inputTwigWatch = 'src/**/*.html.twig';
var inputTwig = 'src/pages/*.html.twig';
var outputTwig = 'docs/';
var inputTwigIndex = 'src/index.html.twig';
var outputTwigIndex = 'docs/';
var baseTwigTemplates = 'src/templates';

// Sass to CSS
var inputSass = 'src/assets/styles/**/*.scss';
var outputSass = 'docs/assets/styles/';
var outputSassDist = 'dist/';
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

// Scripts concat
var outputJs = 'docs/assets/scripts/';
var inputJs = [
      // Native and adapted
      'src/assets/scripts/components/prevent-url.js',
      'src/assets/scripts/components/navbar.js',
      'src/assets/scripts/components/toggle.js',
      'src/assets/scripts/components/dialog.js',
      'src/assets/scripts/components/scrollbar.js',
      'src/assets/scripts/components/scroll-smooth.js',
      'src/assets/scripts/components/slideshow.js',
      'src/assets/scripts/components/lazy-load.js',
      // Vendors
      'src/assets/scripts/vendors/cover-image.js',
      'src/assets/scripts/vendors/svg4everybody.js'
    ];

//-----------------------------------------------------
// Twig templates to HTML
//-----------------------------------------------------

gulp.task('twig', function() {
    return gulp
      .src(inputTwig)
      .pipe(plumber())
      .pipe(twig({ 
        base: baseTwigTemplates, 
        extname: false
      }))
      .pipe(gulp.dest(outputTwig))
      .pipe(browserSync.stream());
});

gulp.task('twigIndex', function() {
    return gulp
      .src(inputTwigIndex)
      .pipe(plumber())
      .pipe(twig({ 
        base: baseTwigTemplates, 
        extname: false
      }))
      .pipe(gulp.dest(outputTwigIndex))
      .pipe(browserSync.stream());
});

//-----------------------------------------------------
// Sass compiler task
//-----------------------------------------------------

gulp.task ('sass' , function() {
    return gulp
      .src(inputSass)
      .pipe(plumber())
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest(outputSass))
      .pipe(gulp.dest(outputSassDist))
      .pipe(cleanCSS())
      .pipe(rename('swanix.min.css'))
      .pipe(gulp.dest(outputSass))
      .pipe(gulp.dest(outputSassDist))
      .pipe(browserSync.stream());
});

//-----------------------------------------------------
// Scripts minification and concat task
//-----------------------------------------------------

gulp.task ('minjs' , function() {
  return gulp
    .src (inputJs)
    .pipe(plumber())
    .pipe(concat('swanix.js'))
    .pipe(gulp.dest(outputJs))
    .pipe(uglify())
    .pipe(rename('swanix.min.js'))
    .pipe(gulp.dest(outputJs))
    .pipe(browserSync.stream());
});

//-----------------------------------------------------
// BrowserSync task (server)
//-----------------------------------------------------

gulp.task ('browser-sync' , function() {
    browserSync.init({
        server: {
          baseDir: 'docs',
          index: 'index.html',     
          serveStaticOptions: {
            extensions: ['html']
          }
        }
    });
    gulp.watch([
      'docs/*.html',
      'dist/styles/*.css'
      ]).on("change", browserSync.reload);
});

//-----------------------------------------------------
// Watch tasks
//-----------------------------------------------------

gulp.task('watch', ['twigIndex', 'twig', 'sass', 'minjs', 'browser-sync'] , function() {
      gulp.watch(inputJs, ['minjs']);
      gulp.watch(inputTwigWatch, ['twig','twigIndex']);
      gulp.watch(inputTwigIndex, ['twig','twigIndex']);
      gulp.watch(inputSass, ['sass']);
});
