/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var camera = window.bmCameraFactory()
        var initEl = document.getElementById('init')

        // initialise the camera handler
        initEl.addEventListener('click', function (e) {
          camera.getPicture({encodingType: Camera.EncodingType.JPEG}).then(function (data) {
            var img = document.getElementById('image')
            img.addEventListener('load', function () {
                img.style.display = 'block'
            })

            img.src = data
          })
          e.preventDefault()
        })

        // hook up cancel handler
        var c = document.getElementById('cancel')
        c.addEventListener('click', function (e) {
          camera.stopVideo()
        })

        var d = document.getElementById('device')
        window.bmCamera.getDevices().then(function (devices) {
          devices.forEach(function (device, idx) {
            d.appendChild(new Option(device.label, idx))
          })
        })

        d.addEventListener('change', function (e) {
          camera.useDevice(camera.availableDevices[d.value])
        })

        console.log('initialised')
    }
};

app.initialize();
