# Camera

[![Greenkeeper badge](https://badges.greenkeeper.io/blinkmobile/camera.svg)](https://greenkeeper.io/)

 [![npm](https://img.shields.io/npm/v/@blinkmobile/camera.svg?maxAge=2592000)](https://www.npmjs.com/package/@blinkmobile/camera)

A Facade over WebRTC or Cordova's Camera plugin for a consistant API

If the cordova camera plug in is detected this plugin assumes that it is inside a Cordova application, otherwise it will assume it is being run in a browser and use the WebRTC protocol, if available.

There are 3 builds, depending on your target:

- [Cordova only](dist/bm-camera-cordova.js)
- [WebRTC only](dist/bm-camera-webrtc.js)
- [Cordova and WebRTC](dist/bm-camera.js)

## Dependencies

- [getusermedia shim](https://www.npmjs.com/package/getusermedia) - It is excluded in the default WebRTC builds. You can use a custom build to include
this file in the bundle, otherwise you must include it in your web project.
See the Build section for more information.

## Supported Browsers

Any browser that is supported by the [getusermedia shim](https://www.npmjs.com/package/getusermedia) is supported. At the time of writing,Safari is unsupported.

## WebRTC example

See the [WebRTC examples](example/webrtc) folder for examples of how to use this library. Note that WebRTC requires the page to load over https for access to the webcam. We recommend using the [http-server](https://www.npmjs.com/package/http-server) node module for this.

## Cordova Example

See the [Cordova Examples](example/cordova) folder for instructions on how to make the Cordova example.

## API

@blinkmobile/camera is a facade around [cordova-plugin-camera](https://www.npmjs.com/package/cordova-plugin-camera#module_Camera.Direction) and [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) that provides an (alomst) unified API.
It is meant to be used in conjuntion with a component framework such as Angular,
React, Vue etc.

@blinkmobile/camera is distributed as a UMD module. If no module system is found it is
bound to the global `window.bmCameraFactory`

`window.bmCameraFactory` or the imported module is a factory function that returns an
instance of either `CordovaCamera` or `WebRTCCamera`, depending on the environment.

### Factory

`window.bmCameraFactory`  or if used in a module system like commonjs `require('@blinkmobile/camera')` is the factory function.

It returns a CordovaCamera or WebRTCCamera instance.

If you are using the WebRTC camera you must pass in a reference to a HTML5 video element which will be used to display the image from the camera. If none is supplied, a `TypeError` will be thrown

### Instance Members

#### availableDevices

A list of video enabled devices supported by the device. Note that in the WebRTC version this list will be an empty array until the user has granted access to the camera. It is therefore recommended that displaying a selection list is done only once the user has granted access to the Camera (this is done via a call to [open](#open))

#### defaultConstraints

The constraints to use when accessing the camera. Generally you will not need to change these, but if you do, you can set the member directly or pass in an object to the [open function](#open)

- [WebRTC Constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints)

- [Cordova Constraints](https://www.npmjs.com/package/cordova-plugin-camera#module_camera.CameraOptions)

### Instance Methods

#### <a name="getDevices"></a> getDevices()

Returns: An array of supported video devices, or an empty array if the user has not yet granted access to the camera.

Cordova camera will always return 2 devices, the front and back camera.

#### <a name="useDevice"></a> useDevice(device)

Returns: undefined

Sets the default constraints of the instance to use the passed in device obtained from a call to `getDevices()`. This is best used for WebRTC implementations only, as the cordova plugin has many device specific [quirks](https://www.npmjs.com/package/cordova-plugin-camera#CameraOptions-quirks), essentially rendering this function useless

#### <a name="open"></a> open(constraints = defaultConstraints)

Returns: Promise

WebRTC projects will request access to the users camera. Once this is granted, `.availableDevices` will be populated and the video element passed to the factory function will display the stream from the video. The returned Promise will be resolved with no arguments

Cordova projects will open the device camera and will resolve with the result, either the image uri or a Base64 Encoded String

#### <a name="getPicture"></a> getPicture()

Returns: Promise

WebRTC projects will take a still image from the video feed.

Cordova projects will use the image taken when [open](#open) was called. If there is no previous image, `open()` will be called to get one.

#### <a name="stop"></a> stop()

Stops the WebRTC video feed and closes the webcam

`undefined` for Cordova Projects


## Build

See [gulpfile](gulpfile.js) for the available tasks.

All tasks will accept the following command line args

- `--buildmode prod` - Builds both minified and unminified libraries
- `--shim true` - Includes the getUserMedia shim in the plugin file.

By default the `dist/` folder contains the lib without the getUserMedia shim.

## Tests

Currently only Chrome is tested, Firefox tests will be available soon.

Tests are run via gulp - `gulp test-webrtc` or npm - `npm test`
