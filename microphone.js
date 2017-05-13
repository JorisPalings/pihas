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
  console.log('Received input stream: ', data.length);
});

micInputStream.on('error', error => {
  console.log('Error in input stream: ', error);
});

micInputStream.on('startComplete', () => {
  console.log('Got SIGNAL startComplete');
});

micInputStream.on('stopComplete', () => {
  console.log('Got SIGNAL stopComplete');
});

micInputStream.on('pauseComplete', () => {
  console.log('Got SIGNAL pauseComplete');
});

micInputStream.on('resumeComplete', () => {
  console.log('Got SIGNAL resumeComplete');
});

micInputStream.on('silence', () => {
  console.log('Got SIGNAL silence');
});

micInputStream.on('processExitComplete', () => {
  console.log('Got SIGNAL processExitComplete');
});

var record = micInstance.start();

module.exports.record = record;
module.exports.inputStream = micInputStream;
