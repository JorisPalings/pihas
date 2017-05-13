'use strict';

// External modules
const stt = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');
const stream = require('stream');
// Configuration module
const config = require('./config');

var speechStream = new stream.PassThrough();

const speechToTextService = new stt({
  username: config.speechToTextUsername,
  password: config.speechToTextPassword
});
var recognizeStream = speechToTextService.createRecognizeStream({ content_type: 'audio/l16; rate=16000' });

var transcribe = () => {
  console.log('Entered transcribe');
  speechStream
  .pipe(recognizeStream)
  .pipe(fs.createWriteStream('./transcription.txt'));
}

speechStream.on('data', (data) => {
  console.log('Data entered speechStream');
  transcribe();
});

speechStream.on('error', (error) => {
  console.log('Error in speechStream: ', error);
});

recognizeStream.on('data', (data) => {
  console.log('Data left recognizeStream');
}):

recognizeStream.on('error', (error) => {
  console.log('Error in recognizeStream: ', error);
});

module.exports.speechStream = speechStream;
module.exports.transcribe = transcribe;
