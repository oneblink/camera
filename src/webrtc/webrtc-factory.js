'use strict'

import WebRTCCamera from './camera.js'

function webRTCFactory (...args) {
  // allows constructor to accept variable number of arguments.
  args.unshift(null)
  return new (WebRTCCamera.bind.apply(WebRTCCamera, args))()
}

export default webRTCFactory
