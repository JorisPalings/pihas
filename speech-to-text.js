'use strict';

// External modules
const stt = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');
// Configuration module
const config = require('./config');

const speechToTextService = new stt({
  username: config.speechToTextUsername,
  password: config.speechToTextPassword
});

var transcribe = function() {
  fs.createReadStream('./speech.wav')
  .pipe(speechToTextService.createRecognizeStream({ content_type: 'audio/l16; rate=16000' }))
  .pipe(fs.createWriteStream('./transcription.txt'));
}

module.exports.transcribe = transcribe;
