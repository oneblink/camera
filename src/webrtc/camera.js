'use strict'

const privateVars = new WeakMap()

// constructor
function WebRTCCamera (videoEl) {
  if (!videoEl) {
    throw new TypeError('WebRTCCamera expects a video element during instansiation')
  }

  this.defaultConstraints = {video: true, audio: false}
  this.availableDevices = []

  privateVars.set(this, {
    videoEl: videoEl,
    stream: null,
    videoTrack: null,
    authorised: false,
    result: null
  })
}

// instance methods
WebRTCCamera.prototype.useDevice = function (device) {
  this.close()

  if (!('deviceId' in device)) {
    throw new TypeError('Invalid device selected, must be of type MediaDeviceInfo')
  }

  this.defaultConstraints.video = this.defaultConstraints.video || {}
  this.defaultConstraints.video.deviceId = {exact: device.deviceId}
}

WebRTCCamera.prototype.getDevices = function () {
  if (!privateVars.get(this).authorised) {
    return Promise.resolve([])
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return Promise.reject(new Error('Media Devices API not supported in this browser'))
  }

  return navigator.mediaDevices.enumerateDevices().then((devices) => {
    this.availableDevices = devices.filter((d) => d.kind.toLowerCase() === 'videoinput')

    return this.availableDevices
  })
}

WebRTCCamera.prototype.open = function (constraints = this.defaultConstraints) {
  constraints = Object.assign({}, this.defaultConstraints, constraints)

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    getUserMedia(constraints, (err, stream) => {
      if (err) {
        return reject(err)
      }

      const videoTracks = stream.getVideoTracks()
      const vars = privateVars.get(this)
      vars.authorised = true

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
  if (!privateVars.get(this).authorised) {
    // eslint-disable-next-line
    return Promise.reject(new DOMException('User has not authorised use of the camera', 'NotAllowedError'))
  }

  const vars = privateVars.get(this)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const videoEl = vars.videoEl

  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight
  ctx.drawImage(vars.videoEl, 0, 0)

  return Promise.resolve(canvas.toDataURL('image/png'))
}

WebRTCCamera.prototype.close = function () {
  privateVars.get(this).videoTrack.stop()
}

export default WebRTCCamera
