'use strict';

// External modules
const stt = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');
const stream = require('stream');
// Configuration module
const config = require('./config');

var speechStream = new stream.Duplex();

const speechToTextService = new stt({
  username: config.speechToTextUsername,
  password: config.speechToTextPassword
});

var transcribe = function() {
  speechStream
  .pipe(speechToTextService.createRecognizeStream({ content_type: 'audio/l16; rate=16000' }))
  .pipe(fs.createWriteStream('./transcription.txt'));
}

speechStream.on('data', (data) => {
  transcribe;
});

module.exports.speechStream = speechStream;
module.exports.transcribe = transcribe;
