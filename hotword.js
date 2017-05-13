'use strict';

// External module
const { Detector, Models } = require('snowboy');

const models = new Models();

models.add({
  file: 'resources/Magically.pmdl',
  sensitivity: '0.5',
  hotwords : 'Magically'
});

const detector = new Detector({
  resource: 'resources/common.res',
  models: models,
  audioGain: 1.0
});

detector.on('silence', () => { /* Event handling */});

detector.on('sound', buffer => { /* Event handling */});

detector.on('error', error => {
  console.error('Error: ', error);
});

detector.on('hotword', (index, hotword, buffer) => {
  console.log('Hotword #' + index + 'detected: ' + hotword);
});

module.exports.detector = detector;
