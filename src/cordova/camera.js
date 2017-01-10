'use strict'

function CordovaCamera () {
  /* eslint-disable no-undef */
  this.availableDevices = [{deviceId: Camera.Direction.BACK, label: 'Rear Camera'},
                           {deviceId: Camera.Direction.FRONT, label: 'Front Camera'}]

  CordovaCamera.defaultConstraints = {
    cameraDirection: Camera.Direction.BACK,
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    encodingType: Camera.EncodingType.PNG,
    sourceType: Camera.PictureSourceType.CAMERA,
    correctOrientation: true
  }
  /* eslint-enable no-undef */
}

// instance methods
CordovaCamera.prototype.getDevices = function () {
  return Promise.resolve(this.availableDevices)
}

CordovaCamera.prototype.useDevice = function (device) {
  if (!('deviceId' in device)) {
    throw new TypeError('Invalid device selected, must be of type MediaDeviceInfo')
  }

  this.defaultConstraints.cameraDirection = device.deviceId
}

CordovaCamera.prototype.open = CordovaCamera.prototype.getPicture = function (constraints = this.defaultConstraints) {
  constraints = Object.assign({}, this.defaultConstraints, constraints)

  return new Promise((resolve, reject) => {
    navigator.camera.getPicture(resolve, reject, constraints)
  })
}

export default CordovaCamera
