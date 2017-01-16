'use strict'

import CordovaCamera from './camera.js'

function cordovaFactory (...args) {
  // allows constructor to accept variable number of arguments.
  args.unshift(null)
  return new (CordovaCamera.bind.apply(CordovaCamera, args))()
}

export default cordovaFactory
