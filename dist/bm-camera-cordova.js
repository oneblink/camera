/*
 * @blinkmobile/camera: v0.0.3 | https://github.com/blinkmobile/camera
 * (c) 2017 BlinkMobile | Released under the ISC license
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.bmCameraFactory = factory());
}(this, (function () { 'use strict';

var privateVars = new WeakMap();

function CordovaCamera() {
  /* eslint-disable no-undef */
  this.availableDevices = [{ deviceId: Camera.Direction.BACK, label: 'Rear Camera' }, { deviceId: Camera.Direction.FRONT, label: 'Front Camera' }];

  this.defaultConstraints = {
    cameraDirection: Camera.Direction.BACK,
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    encodingType: Camera.EncodingType.PNG,
    sourceType: Camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };
  /* eslint-enable no-undef */

  privateVars.set(this, { result: null });
}

// instance methods
CordovaCamera.prototype.getDevices = function () {
  return Promise.resolve(this.availableDevices);
};

CordovaCamera.prototype.useDevice = function (device) {
  if (!('deviceId' in device)) {
    throw new TypeError('Invalid device selected, must be of type MediaDeviceInfo');
  }

  this.defaultConstraints.cameraDirection = device.deviceId;
};

CordovaCamera.prototype.open = function () {
  var _this = this;

  var constraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.defaultConstraints;

  constraints = Object.assign({}, this.defaultConstraints, constraints);

  return new Promise(function (resolve, reject) {
    var onSuccess = function onSuccess(data) {
      privateVars.get(_this).result = data;
      resolve(data);
    };
    navigator.camera.getPicture(onSuccess, reject, constraints);
  });
};

CordovaCamera.prototype.getPicture = function () {
  var constraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.defaultConstraints;

  var privates = privateVars.get(this);

  if (!privates.result) {
    return this.open(constraints).then(function () {
      var result = privates.result;
      privates.result = null;
      return result;
    });
  }

  return Promise.resolve(privates.result);
};

function cordovaFactory() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // allows constructor to accept variable number of arguments.
  args.unshift(null);
  return new (CordovaCamera.bind.apply(CordovaCamera, args))();
}

return cordovaFactory;

})));
