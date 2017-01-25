/*
 * @blinkmobile/camera: v0.0.1 | https://github.com/blinkmobile/camera
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

var privateVars$1 = new WeakMap();

// constructor
function WebRTCCamera(videoEl) {
  if (!videoEl) {
    throw new TypeError('WebRTCCamera expects a video element during instansiation');
  }

  this.defaultConstraints = { video: true, audio: false };
  this.availableDevices = [];

  privateVars$1.set(this, {
    videoEl: videoEl,
    stream: null,
    videoTrack: null,
    authorised: false,
    result: null
  });
}

// instance methods
WebRTCCamera.prototype.useDevice = function (device) {
  this.stopVideo();

  if (!('deviceId' in device)) {
    throw new TypeError('Invalid device selected, must be of type MediaDeviceInfo');
  }

  this.defaultConstraints.video = this.defaultConstraints.video || {};
  this.defaultConstraints.video.deviceId = { exact: device.deviceId };
};

WebRTCCamera.prototype.getDevices = function () {
  var _this = this;

  if (!privateVars$1.get(this).authorised) {
    return Promise.resolve([]);
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return Promise.reject(new Error('Media Devices API not supported in this browser'));
  }

  return navigator.mediaDevices.enumerateDevices().then(function (devices) {
    _this.availableDevices = devices.filter(function (d) {
      return d.kind.toLowerCase() === 'videoinput';
    });

    return _this.availableDevices;
  });
};

WebRTCCamera.prototype.open = function () {
  var _this2 = this;

  var constraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.defaultConstraints;

  constraints = Object.assign({}, this.defaultConstraints, constraints);

  return new Promise(function (resolve, reject) {
    // eslint-disable-next-line
    getUserMedia(constraints, function (err, stream) {
      if (err) {
        return reject(err);
      }

      var videoTracks = stream.getVideoTracks();
      var vars = privateVars$1.get(_this2);
      vars.authorised = true;

      if (!videoTracks.length) {
        vars.stream = null;
        vars.videoTrack = null;

        return reject(new Error('Could not get a video track from stream'));
      }

      vars.videoEl.addEventListener('canplay', resolve, { once: true });

      vars.videoTrack = videoTracks[0];
      vars.stream = stream;
      vars.videoEl.srcObject = stream;
    });
  });
};

WebRTCCamera.prototype.getPicture = function () {
  if (!privateVars$1.get(this).authorised) {
    // eslint-disable-next-line
    return Promise.reject(new DOMException('User has not authorised use of the camera', 'NotAllowedError'));
  }

  var vars = privateVars$1.get(this);
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var videoEl = vars.videoEl;

  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  ctx.drawImage(vars.videoEl, 0, 0);

  return Promise.resolve(canvas.toDataURL('image/png'));
};

WebRTCCamera.prototype.close = function () {
  privateVars$1.get(this).videoTrack.stop();
};

function webRTCFactory() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // allows constructor to accept variable number of arguments.
  args.unshift(null);
  return new (WebRTCCamera.bind.apply(WebRTCCamera, args))();
}

function cameraFactory() {
  var useCordova = !!(window.Camera && navigator.camera);

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (useCordova) {
    return cordovaFactory.apply(null, args);
  }

  return webRTCFactory.apply(null, args);
}

return cameraFactory;

})));
