'use strict'

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')

// rollup specific
const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const eslint = require('rollup-plugin-eslint')

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
})

gulp.task('default', ['clean'], () => {
  return rollup({
    entry: 'src/index.js',
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      // eslint({
      //   exclude: []
      // }),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      dest: `${DEST}/${FILENAME}`
    })
  })
})

  // return gulp.src('src/**/*.js')
  //   .pipe(sourcemaps.init())
  //   .pipe(rollup({
  //     format: 'iife',
  //     plugins: [
  //       resolve({
  //         jsnext: true,
  //         main: true,
  //         browser: true
  //       }),
  //       commonjs(),
  //       babel({
  //         exclude: 'node_modules/**',
  //         presets: ['es2015-rollup']
  //       })
  //     ]
  //   }))
  //   .pipe(concat(FILENAME))
  //   .pipe(sourcemaps.write('.'))
  //   .pipe(gulp.dest(DEST))
// })
