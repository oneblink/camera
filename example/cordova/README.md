# Using blink-camera with cordova

## Setup of the example

- open a shell
- Install Cordova if it is not installed 
-- `npm i -g cordova`
- Initialise a folder to be your Cordova root
-- `cordova create com.blink.cameratest`
-- `cd com.blink.cameratest`
- Add the cordova camera plugin, make sure to save this plugin reference
-- `cordova plugin add cordova-plugin-camera --save`
- Copy the `www` folder from this repo over the top of the existing `www` folder
- Add your platforms to your cordova project
-- `cordova platform add android`
- Run the example
-- `cordova run android`
