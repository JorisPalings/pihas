// External modules
const mic = require('mic');
const fs = require('fs');

var micInstance = mic({
  'rate': '44100',
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

var record = micInstance.start();

module.exports.record = record;
module.exports.inputStream = micInputStream;
