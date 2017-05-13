// External modules
const mic = require('mic');
const fs = require('fs');

var micInstance = mic({
  'rate': '16000',
  'channels': '1',
  'debug': true
});
var micInputStream = micInstance.getAudioStream();

micInputStream.on('data', data => {
  logUpdate('Receiving data...');
  logUpdate.clear();
});

/*
  Event handling

micInputStream.on('error', error => {
  console.log('Error in input stream: ', error);
});

micInputStream.on('startComplete', () => {
  console.log('Recording started.');
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
  logUpdate('Receiving silence...');
  logUpdate.clear();
});

micInputStream.on('processExitComplete', () => {
  console.log('Recording process exited.');
});

*/

var record = micInstance.start();

module.exports.record = record;
module.exports.inputStream = micInputStream;
