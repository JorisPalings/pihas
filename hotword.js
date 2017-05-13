'use strict';

// External module
const { Detector, Models } = require('snowboy');

const models = new Models();

models.add({
  file: 'resources/hipi.pmdl',
  sensitivity: '0.5',
  hotwords : 'hi pi'
});

const detector = new Detector({
  resource: 'resources/common.res',
  models: models,
  audioGain: 1.0
});

detector.on('silence', function() {
  console.log('silence');
});

detector.on('sound', function(buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream
  console.log('sound');
});

detector.on('error', function () {
  console.log('error');
});

detector.on('hotword', function(index, hotword, buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream
  console.log('hotword', index, hotword);
});

module.exports.detector = detector;
