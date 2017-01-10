'use strict'

import getUserMedia from 'getusermedia'

const isEnabled = (window.URL &&
                   window.URL.createObjectURL &&
                   (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia) ||
                    !!navigator.mediaDevices)

const defaultConstraints = {video: true, audio: false}

// constructor
function WebRTCCamera () {
  this.stream = null
  this.videoTrack = null
}

// static properties
WebRTCCamera.availableDevices = null

// static functions
WebRTCCamera.getDevices = function () {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return Promise.reject(new Error('Media Devices API not supported in this browser'))
  }

  return navigator.mediaDevices.enumerateDevices().then((devices) => {
    WebRTCCamera.availableDevices = devices.filter((d) => d.kind.toLowerCase() === 'videoinput')

    return WebRTCCamera.availableDevices
    // eslint-disable-next-line no-console
  }).catch((err) => console.error(err.name + ': ' + err.message))
}

// instance methods
WebRTCCamera.prototype.init = function (constraints = defaultConstraints) {
  if (!isEnabled) {
    return Promise.reject(new Error('WebRTC camera is not available'))
  }

  return this.getStream(constraints)
}

WebRTCCamera.prototype.getStream = function (constraints = defaultConstraints) {
  return new Promise((resolve, reject) => {
    getUserMedia(constraints, (err, stream) => {
      if (err) {
        return reject(err)
      }

      const videoTracks = stream.getVideoTracks()
      if (!videoTracks.length) {
        this.stream = null
        this.videoTrack = null

        return reject(new Error('Could not get a video track from stream'))
      }

      this.videoTrack = videoTracks[0]
      this.stream = stream

      resolve(this.stream)
    })
  })
}

WebRTCCamera.prototype.useDevice = function (device) {
  this.stopVideo()

  if (!('deviceId' in device)) {
    throw new TypeError('Invalid device selected, must be of type MediaDeviceInfo')
  }
  const constraints = {
    audio: false,
    video: {
      deviceId: { exact: device.deviceId }
    }
  }

  return this.getStream(constraints)
}

WebRTCCamera.prototype.stopVideo = function () {
  this.videoTrack.stop()
}

export {isEnabled, WebRTCCamera, getUserMedia as source}
