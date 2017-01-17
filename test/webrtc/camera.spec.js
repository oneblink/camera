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
      const expected = 'data:image/png;base64,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E1AAwwI3LgECBAgQIEBAAbQDBAgQIECAAIEwAQUwLHDjEiBAgAABAgQUQDtAgAABAgQIEAgTUADDAjcuAQIECBAgQEABtAMECBAgQIAAgTABBTAscOMSIECAAAECBBRAO0CAAAECBAgQCBNQAMMCNy4BAgQIECBAQAG0AwQIECBAgACBMAEFMCxw4xIgQIAAAQIEFEA7QIAAAQIECBAIE1AAwwI3LgECBAgQIEBAAbQDBAgQIECAAIEwAQUwLHDjEiBAgAABAgQUQDtAgAABAgQIEAgTUADDAjcuAQIECBAgQEABtAMECBAgQIAAgTABBTAscOMSIECAAAECBBRAO0CAAAECBAgQCBNQAMMCNy4BAgQIECBAQAG0AwQIECBAgACBMAEFMCxw4xIgQIAAAQIEFEA7QIAAAQIECBAIE1AAwwI3LgECBAgQIEBAAbQDBAgQIECAAIEwAQUwLHDjEiBAgAABAgQUQDtAgAABAgQIEAgTUADDAjcuAQIECBAgQEABtAMECBAgQIAAgTABBTAscOMSIECAAAECBBRAO0CAAAECBAgQCBNQAMMCNy4BAgQIECBAQAG0AwQIECBAgACBMAEFMCxw4xIgQIAAAQIEFEA7QIAAAQIECBAIE1AAwwI3LgECBAgQIEBAAbQDBAgQIECAAIEwAQUwLHDjEiBAgAABAgQUQDtAgAABAgQIEAgTUADDAjcuAQIECBAgQEABtAMECBAgQIAAgTABBTAscOMSIECAAAECBBRAO0CAAAECBAgQCBNQAMMCNy4BAgQIECBAQAG0AwQIECBAgACBMAEFMCxw4xIgQIAAAQIEFEA7QIAAAQIECBAIE1AAwwI3LgECBAgQIEBAAbQDBAgQIECAAIEwAQUwLHDjEiBAgAABAgQUQDtAgAABAgQIEAgTUADDAjcuAQIECBAgQEABtAMECBAgQIAAgTABBTAscOMSIECAAAECBBRAO0CAAAECBAgQCBNQAMMCNy4BAgQIECBAQAG0AwQIECBAgACBMAEFMCxw4xIgQIAAAQIEFEA7QIAAAQIECBAIE1AAwwI3LgECBAgQIEBAAbQDBAgQIECAAIEwAQUwLHDjEiBAgAABAgQUQDtAgAABAgQIEAgTUADDAjcuAQIECBAgQEABtAMECBAgQIAAgTABBTAscOMSIECAAAECBBRAO0CAAAECBAgQ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AQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBD5J41cAAAGhSURBVBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAAQXQDhAgQIAAAQIEwgQUwLDAjUuAAAECBAgQUADtAAECBAgQIEAgTEABDAvcuAQIECBAgAABBdAOECBAgAABAgTCBBTAsMCNS4AAAQIECBBQAO0AAQIECBAgQCBMQAEMC9y4BAgQIECAAAEF0A4QIECAAAECBMIEFMCwwI1LgAABAgQIEFAA7QABAgQIECBAIExAAQwL3LgECBAgQIAAgf8D+LBDqEDmqYcAAAAASUVORK5CYII='
      camera.open()
            .then(() => camera.getPicture())
            .then((result) => expect(result).toBe(expected))
            .then(done)
            .catch(done.fail)
    })
  })
})
/* eslint-enable no-undef */