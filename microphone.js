// External modules
const mic = require('mic');
const fs = require('fs');
const events = require('events');

// Proprietary modules
const hotword = require('./hotword');
const speechToText = require('./speech-to-text');

var micInstance = mic({
  'rate': '16000',
  'channels': '1'
});
var micInputStream = micInstance.getAudioStream();

micInputStream.on('startComplete', () => {
  console.log('Recording started.');
});

micInputStream.on('error', error => {
  console.log('Error in input stream: ', error);
});

/*
  Event handling

micInputStream.on('data', data => {
  console.log('Receiving data...');
});

micInputStream.on('stopComplete', () => {
  console.log('Recording stopped.');
});

micInputStream.on('pauseComplete', () => {
  console.log('Recording paused');
});

micInputStream.on('resumeComplete', () => {
  console.log('Recording resumed.');
});

micInputStream.on('silence', () => {
  console.log('Receiving silence...');
});

micInputStream.on('processExitComplete', () => {
  console.log('Recording process exited.');
});

*/

// Custom EventEmitter to switch between stream outputs
var micEmitter = new events.EventEmitter();

micEmitter.on('hotword', () => {
  console.log('Hotword event detected');
  switchOutputStream(speechToText.speechStream);
});

micEmitter.on('error', () => {
  console.log('Error in MicEmitter: ', error);
});

var startRecording = () => {
  console.log('Entered startRecording');
  micInstance.start();
  micInputStream.pipe(hotword.detector)
}

var switchOutputStream = (destination) => {
  console.log('Entered switchOutputStream');
  micInputStream.pause();
  micInputStream.unpipe();
  micInputStream.pipe(destination);
  micInputStream.resume();
}

module.exports.micEmitter = micEmitter;
module.exports.startRecording = startRecording;
module.exports.inputStream = micInputStream;
