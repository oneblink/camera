'use strict'

import CordovaCamera from './cordova/camera.js'
import WebRTCCamera from './webrtc/camera.js'

function cameraFactory (...args) {
  const useCordova = !!(window.Camera && navigator.camera)
  let Constructor

  // allows constructor to accept variable number od arguments.
  args.unshift(null)

  if (useCordova) {
    Constructor = CordovaCamera.bind.apply(CordovaCamera, args)
  } else {
    Constructor = WebRTCCamera.bind.apply(WebRTCCamera, args)
  }

  return new Constructor()
}

export default cameraFactory
