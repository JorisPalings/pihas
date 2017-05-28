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

var createRecognizeStream = () => {
  console.log('Initializing recognizeStream');
  recognizeStream = speechToTextService.createRecognizeStream(speechToTextParameters);
  console.log('Initialized recognizeStream');

  recognizeStream.on('data', (data) => {
    console.log('Data left recognizeStream');
  });

  recognizeStream.on('error', (error) => {
    console.log('Error in recognizeStream: ', error);
  });

  recognizeStream.on('close', (error) => {
    console.log('Closed recognizeStream');
  });
  // Feedback 2
}

var transcribe = () => {
  console.log('Entered transcribe');
  let outputStream = fs.createWriteStream('./transcription.txt');
  console.log('Set up an outputStream');
  speechStream
  .pipe(recognizeStream)
  .pipe(outputStream);
  console.log('Piped speechStream to recognizeStream to outputStream');
  outputStream.end();
  console.log('outputStream ended');
}

speechStream.on('data', (data) => {
  console.log('Data entered speechStream');
  transcribe();
});

speechStream.on('error', (error) => {
  console.log('Error in speechStream: ', error);
});

module.exports.createRecognizeStream = createRecognizeStream;
module.exports.speechStream = speechStream;
module.exports.transcribe = transcribe;
