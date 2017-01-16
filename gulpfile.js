'use strict'

const gulp = require('gulp')
const util = require('gulp-util')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const del = require('del')

const devBanner = require('./buildfiles/banner.js').devBanner
const prodBanner = require('./buildfiles/banner.js').prodBanner

const pkg = require('./package.json')

// rollup specific
const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const eslint = require('rollup-plugin-eslint')
const inject = require('rollup-plugin-inject')

// set based on command line flags
const PROD_BUILD = (util.env.buildmode || '').toLowerCase().indexOf('prod') >= 0
const USE_SHIM = util.env.shim || false

const DEST = 'dist'
const FILENAME = 'bm-camera.js'
const FILENAME_CORDOVA = 'bm-camera-cordova.js'
const FILENAME_WEBRTC = 'bm-camera-webrtc.js'

const banner = PROD_BUILD ? prodBanner(pkg) : devBanner(pkg)

const makeBundle = function (entry, destFilename) {
  const plugins = [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    eslint({
      exclude: []
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]

  if (USE_SHIM) {
    plugins.push(inject({
      include: './src/webrtc/camera.js',
      getUserMedia: 'getusermedia'
    }))
  }

  return rollup({entry, plugins})
    .then(function (bundle) {
      const bundleOpts = {
        format: 'umd',
        moduleName: 'bmCameraFactory',
        dest: `${DEST}/${destFilename}`,
        banner: banner
      }

      if (USE_SHIM) {
        bundleOpts.globals = {
          getusermedia: 'getUserMedia'
        }
      }
      return bundle.write(bundleOpts)
    })
}

const minifiedName = (strings, filename) => filename.replace(/\.js$/, '.min.js')

const minify = function (fileName) {
  return () => {
    gulp.src(`${DEST}/${fileName}`)
        .pipe(rename(minifiedName`${fileName}`))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(gulp.dest(DEST))
  }
}

// notify the developer about what is being built
// eslint-disable-next-line
console.log(`Creating a ${PROD_BUILD ? 'production' : 'development'} build
${!USE_SHIM ? 'NOT ' : ''}using getUserMedia Shim
-----------------------------
${banner.replace(/^\/?\s?\*\/?/gm, '')}`)

/* ///////////////////// gulp tasks */

gulp.task('clean', () => {
  return del(DEST)
})

gulp.task('both', () => {
  let cb = () => true
  if (PROD_BUILD) {
    cb = minify(FILENAME)
  }
  return makeBundle('src/camera-factory.js', FILENAME).then(cb)
})

gulp.task('cordova', () => {
  let cb = () => true
  if (PROD_BUILD) {
    cb = minify(FILENAME_CORDOVA)
  }
  return makeBundle('src/cordova/cordova-factory.js', FILENAME_CORDOVA)
    .then(cb)
})

gulp.task('webrtc', () => {
  let cb = () => true
  if (PROD_BUILD) {
    cb = minify(FILENAME_WEBRTC)
  }
  return makeBundle('src/webrtc/webrtc-factory.js', FILENAME_WEBRTC)
    .then(cb)
})

gulp.task('default', ['clean', 'both', 'cordova', 'webrtc'], () => {})
