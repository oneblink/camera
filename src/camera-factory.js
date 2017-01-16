'use strict'

import cordovaFactory from './cordova/cordova-factory.js'
import webRTCFactory from './webrtc/webrtc-factory.js'

function cameraFactory (...args) {
  const useCordova = !!(window.Camera && navigator.camera)

  if (useCordova) {
    return cordovaFactory.apply(null, args)
  }

  return webRTCFactory.apply(null, args)
}

export default cameraFactory
