/*
 * @blinkmobile/camera: v0.0.3 | https://github.com/blinkmobile/camera
 * (c) 2017 BlinkMobile | Released under the ISC license
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.bmCameraFactory = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var privateVars = new WeakMap();

// constructor
function WebRTCCamera(videoEl) {
  if (!videoEl) {
    throw new TypeError('WebRTCCamera expects a video element during instansiation');
  }

  this.defaultConstraints = { video: true, audio: false };
  this.availableDevices = [];

  privateVars.set(this, {
    videoEl: videoEl,
    stream: null,
    videoTrack: null,
    authorised: false,
    result: null
  });
}

// instance methods
WebRTCCamera.prototype.useDevice = function (device) {
  this.close();

  if (!('deviceId' in device)) {
    throw new TypeError('Invalid device selected, must be of type MediaDeviceInfo');
  }

  var newConstraints = _typeof(this.defaultConstraints.video) === 'object' ? this.defaultConstraints.video : {};

  newConstraints.deviceId = { exact: device.deviceId };
  this.defaultConstraints.video = newConstraints;

  return this.open();
};

WebRTCCamera.prototype.getDevices = function () {
  var _this = this;

  if (!privateVars.get(this).authorised) {
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
      var vars = privateVars.get(_this2);
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
  if (!privateVars.get(this).authorised) {
    // eslint-disable-next-line
    return Promise.reject(new DOMException('User has not authorised use of the camera', 'NotAllowedError'));
  }

  var vars = privateVars.get(this);
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var videoEl = vars.videoEl;

  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  ctx.drawImage(vars.videoEl, 0, 0);

  return Promise.resolve(canvas.toDataURL('image/png'));
};

WebRTCCamera.prototype.close = function () {
  var track = privateVars.get(this).videoTrack;
  track && track.stop();
};

function webRTCFactory() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // allows constructor to accept variable number of arguments.
  args.unshift(null);
  return new (WebRTCCamera.bind.apply(WebRTCCamera, args))();
}

return webRTCFactory;

})));
