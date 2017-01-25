'use strict'

/* eslint-disable no-undef */
describe('WebRTC Facade', () => {
  let v
  beforeEach(() => {
    v = document.createElement('video')
    v.setAttribute('id', 'video')
    document.body.appendChild(v)
  })

  afterEach(() => {
    v.parentNode.removeChild(v)
    v = null
  })

  describe('Constructor', () => {
    it('should throw a type error if no video element is supplied', function () {
      expect(() => { bmCameraFactory() }).toThrow()
    })
  })

  describe('#getDevices', () => {
    it('should resolve with an empty array because camera access has not been granted', (done) => {
      const camera = bmCameraFactory(v)
      camera.getDevices().then((result) => expect(result).toEqual([])).then(done)
    })

    it('should call navigator.mediaDevices.enumerateDevices', (done) => {
      const camera = bmCameraFactory(v)

      spyOn(navigator.mediaDevices, 'enumerateDevices').and.callThrough()
      camera.open()
            .then(() => camera.getDevices())
            .then((devices) => expect(navigator.mediaDevices.enumerateDevices).toHaveBeenCalled())
            .then(() => done())
            .catch((e) => {
              done.fail()
            })
    })
  })

  describe('#useDevice', () => {
    it('should set the device in defaultConstraints', (done) => {
      const camera = bmCameraFactory(v)
      const deviceId = 'abcd'
      const newDevice = {deviceId}

      camera.open = () => Promise.resolve()

      camera.open()
            .then(() => camera.useDevice(newDevice))
            .then(() => {
              expect(camera.defaultConstraints.video.deviceId.exact).toEqual(deviceId)
              done()
            })
            .catch((err) => done.fail(err))
    })

    it('should only modify the deviceId property', (done) => {
      const camera = bmCameraFactory(v)
      const deviceId = 'abcd'
      const newDevice = {deviceId}
      const expected = {
        audio: false,
        video: {
          facingMode: 'a',
          aspectRatio: {exact: 'b'},
          deviceId: {exact: deviceId}
        }
      }

      camera.open = () => Promise.resolve()
      camera.defaultConstraints = {
        audio: false,
        video: {
          facingMode: 'a',
          aspectRatio: {exact: 'b'},
          deviceId: {exact: 'def'}
        }
      }

      camera.open()
            .then(() => camera.useDevice(newDevice))
            .then(() => {
              expect(camera.defaultConstraints.video.deviceId.exact).toEqual(deviceId)

              const checkObj = (obj, expectedObj) => {
                for (let prop in camera.defaultConstraints) {
                  if (typeof obj[prop] === 'object') {
                    checkObj(obj[prop], expectedObj[prop])
                  } else {
                    expect(obj[prop]).toEqual(expectedObj[prop])
                  }
                }
              }

              checkObj(camera.defaultConstraints, expected)
              done()
            })
            .catch((err) => done.fail(err))
    })

    it('should throw a type error when called with an invalid device', (done) => {
      const camera = bmCameraFactory(v)
      const deviceId = 'abcd'

      camera.open = () => Promise.resolve()

      camera.open()
            .then(() => {
              expect(() => camera.useDevice(deviceId)).toThrow()
              done()
            })
            .catch((err) => done.fail(err))
    })
  })

  describe('#open', () => {
    it('should call getUserMedia with the default constraints', (done) => {
      const camera = bmCameraFactory(v)
      const expected = camera.defaultConstraints

      spyOn(window, 'getUserMedia').and.callThrough()
      camera.open()
            .then(() => expect(window.getUserMedia.calls.first().args[0]).toEqual(expected))
            .then(done)
            .catch(done.fail)
    })

    it('should merge the passed in constraints', (done) => {
      const camera = bmCameraFactory(v)
      const expected = Object.assign({}, camera.defaultConstraints, {merged: true})

      spyOn(window, 'getUserMedia').and.callThrough()
      camera.open({merged: true})
            .then(() => expect(window.getUserMedia.calls.first().args[0]).toEqual(expected))
            .then(done)
            .catch(done.fail)
    })
  })

  describe('#getPicture', () => {
    it('should reject because access to webcam has not been granted', (done) => {
      const camera = bmCameraFactory(v)

      camera.getPicture()
            .then(done.fail)
            .catch(done)
    })

    it('should resolve because access to webcam has been granted', (done) => {
      const camera = bmCameraFactory(v)
      camera.open()
            .then(() => camera.getPicture())
            .then((result) => expect(result).not.toBe(null))
            .then(done)
            .catch(done.fail)
    })
  })
})
/* eslint-enable no-undef */
