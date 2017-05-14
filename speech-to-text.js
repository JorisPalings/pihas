'use strict';

// External modules
const stt = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');
const stream = require('stream');
// Configuration module
const config = require('./config');

var recognizeStream;
var speechStream = new stream.PassThrough();

const speechToTextService = new stt({
  username: config.speechToTextUsername,
  password: config.speechToTextPassword
});
var speechToTextParameters = {
  'content_type': 'audio/l16; rate=16000',
  'inactivity_timeout': 5,
  'interim_results': false,
  'max_alternatives': 1,
  'word_confidence': false,
  'timestamps': false,
  'keywords': ['spotify', 'play', 'stop', 'pause', 'resume', 'track', 'album', 'artist', 'playlist', 'lyrics'],
  'keywords_threshold': 0.5,
  'profanity_filter': false
}

function createRecognizeStream = () => {
  recognizeStream = speechToTextService.createRecognizeStream(speechToTextParameters);
}

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
});

recognizeStream.on('error', (error) => {
  console.log('Error in recognizeStream: ', error);
});


recognizeStream.on('close', (error) => {
  console.log('Closed recognizeStream');
});

module.exports.createRecognizeStream = createRecognizeStream;
module.exports.speechStream = speechStream;
module.exports.transcribe = transcribe;
