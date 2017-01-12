'use strict'

import getUserMedia from 'getusermedia'

const privateVars = new WeakMap()

// constructor
function WebRTCCamera (videoEl) {
  this.defaultConstraints = {video: true, audio: false}

  privateVars.set(this, {
    videoEl: videoEl,
    stream: null,
    videoTrack: null
  })
}

// static properties
WebRTCCamera.availableDevices = null

// instance methods
WebRTCCamera.prototype.useDevice = function (device) {
  this.stopVideo()

  if (!('deviceId' in device)) {
    throw new TypeError('Invalid device selected, must be of type MediaDeviceInfo')
  }

  this.defaultConstraints = {
    audio: false,
    video: {
      deviceId: { exact: device.deviceId }
    }
  }
}

WebRTCCamera.prototype.getDevices = function () {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return Promise.reject(new Error('Media Devices API not supported in this browser'))
  }

  return navigator.mediaDevices.enumerateDevices().then((devices) => {
    WebRTCCamera.availableDevices = devices.filter((d) => d.kind.toLowerCase() === 'videoinput')

    return WebRTCCamera.availableDevices
  })
}

WebRTCCamera.prototype.open = function (constraints = this.defaultConstraints) {
  constraints = Object.assign({}, WebRTCCamera.defaultConstraints, constraints)

  return new Promise((resolve, reject) => {
    getUserMedia(constraints, (err, stream) => {
      if (err) {
        return reject(err)
      }

      const videoTracks = stream.getVideoTracks()
      const vars = privateVars.get(this)
      if (!videoTracks.length) {
        vars.stream = null
        vars.videoTrack = null

        return reject(new Error('Could not get a video track from stream'))
      }

      vars.videoEl.addEventListener('canplay', resolve, {once: true})

      vars.videoTrack = videoTracks[0]
      vars.stream = stream
      vars.videoEl.srcObject = stream
    })
  })
}

WebRTCCamera.prototype.getPicture = function () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const videoEl = privateVars.get(this).videoEl
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight

  ctx.drawImage(privateVars.get(this).videoEl, 0, 0)
  return Promise.resolve(canvas.toDataURL('image/png'))
}

WebRTCCamera.prototype.stop = function () {
  privateVars.get(this).videoTrack.stop()
}

export default WebRTCCamera
