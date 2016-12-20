'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const del = require('del')

const DEST = 'dist'
const FILENAME = 'bm-camera.js'
const FILENAME_MIN = 'bm-camera.min.js'

gulp.task('clean', () => {
  return del(DEST)
})

gulp.task('minify', ['default'], function () {
  return gulp.src(`${DEST}/${FILENAME}`)
        .pipe(rename(FILENAME_MIN))
        .pipe(uglify())
        .pipe(gulp.dest(DEST))
});

gulp.task('default', ['clean'], () => {
  return gulp.src('src/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat(FILENAME))
    .pipe(gulp.dest(DEST))
})
