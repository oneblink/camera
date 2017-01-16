/*
 * @blinkmobile/blink-camera: v0.0.1 | https://github.com/blinkmobile/blink-camera
 * (c) 2017 BlinkMobile | Released under the ISC license
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

function CordovaCamera() {
  /* eslint-disable no-undef */
  this.availableDevices = [{ deviceId: Camera.Direction.BACK, label: 'Rear Camera' }, { deviceId: Camera.Direction.FRONT, label: 'Front Camera' }];

  CordovaCamera.defaultConstraints = {
    cameraDirection: Camera.Direction.BACK,
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    encodingType: Camera.EncodingType.PNG,
    sourceType: Camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };
  /* eslint-enable no-undef */
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

CordovaCamera.prototype.open = CordovaCamera.prototype.getPicture = function () {
  var constraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.defaultConstraints;

  constraints = Object.assign({}, this.defaultConstraints, constraints);

  return new Promise(function (resolve, reject) {
    navigator.camera.getPicture(resolve, reject, constraints);
  });
};

function cordovaFactory$2() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // allows constructor to accept variable number od arguments.
  args.unshift(null);
  var Constructor = CordovaCamera.bind.apply(CordovaCamera, args);

  return new Constructor();
}

function cordovaFactory() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // allows constructor to accept variable number of arguments.
  args.unshift(null);
  return new (cordovaFactory$2.bind.apply(cordovaFactory$2, args))();
}

window.bmCameraFactory = cordovaFactory;

})));
