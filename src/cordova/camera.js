'use strict'

const privateVars = new WeakMap()

function CordovaCamera () {
  /* eslint-disable no-undef */
  this.availableDevices = [{deviceId: Camera.Direction.BACK, label: 'Rear Camera'},
                           {deviceId: Camera.Direction.FRONT, label: 'Front Camera'}]

  this.defaultConstraints = {
    cameraDirection: Camera.Direction.BACK,
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    encodingType: Camera.EncodingType.PNG,
    sourceType: Camera.PictureSourceType.CAMERA,
    correctOrientation: true
  }
  /* eslint-enable no-undef */

  privateVars.set(this, {result: null})
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

CordovaCamera.prototype.open = function (constraints = this.defaultConstraints) {
  constraints = Object.assign({}, this.defaultConstraints, constraints)

  return new Promise((resolve, reject) => {
    const onSuccess = (data) => {
      privateVars.get(this).result = data
      resolve(data)
    }
    navigator.camera.getPicture(onSuccess, reject, constraints)
  })
}

CordovaCamera.prototype.getPicture = function (constraints = this.defaultConstraints) {
  const privates = privateVars.get(this)

  if (!privates.result) {
    return this.open(constraints).then(() => {
      const result = privates.result
      privates.result = null
      return result
    })
  }

  return Promise.resolve(privates.result)
}

export default CordovaCamera
