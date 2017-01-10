'use strict'

import {isEnabled as useCordovaCamera, getPicture as cordovaGetPicture} from './cordova/camera.js'
// eslint-disable-next-line no-unused-vars
import {isEnabled as useWebRTCCamera, WebRTCCamera} from './webrtc/camera.js'
// eslint-disable-next-line no-unused-vars
const Camera = useCordovaCamera ? cordovaGetPicture : WebRTCCamera

export default Camera

