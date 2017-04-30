const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const stt = require('watson-developer-cloud/speech-to-text/v1');
const opn = require('opn');
const clapDetector = require('clap-detector');

const clapConfig = {
  AUDIO_SOURCE: 'hw:1,0',
  DETECTION_PERCENTAGE_START : '5%', // minimum noise percentage threshold necessary to start recording sound
  DETECTION_PERCENTAGE_END: '5%',  // minimum noise percentage threshold necessary to stop recording sound
  CLAP_AMPLITUDE_THRESHOLD: 0.25, // minimum amplitude threshold to be considered as clap
  CLAP_ENERGY_THRESHOLD: 0.3,
  MAX_HISTORY_LENGTH: 10
};

clapDetector.start(clapConfig);

clapDetector.onClap(function() {
  console.log('Clap');
});

const port = 3000;

const app = express();
app.use(bodyParser.json());

const spotifyClientId  = 'edc31dde57474c858452da14dbfaabc2';
const spotifyClientSecret = '48ba46b8be494bb0b0066e2ac82e31fd';
const redirectUri = 'http://localhost:' + port + '/auth';

var accessToken;

app.get('/login', function(req, res) {
  let scopes = 'playlist-read-private playlist-read-collaborative user-follow-read user-library-read user-read-private user-top-read';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + spotifyClientId +
    '&scope=' + encodeURIComponent(scopes) +
    '&redirect_uri=' + encodeURIComponent(redirectUri));
});

app.get('/auth', function(req, res) {
  console.log('get to /auth');
  try {
    let code = req.query.code;
    requestAccessToken(code).then(body => {
      accessToken = body.access_token;
      res.status(200).end();
    });
  } catch(e) {
    console.log(e);
    res.status(500).end();
  }
});

app.get('/search', function(req, res) {
  console.log('get to /search');
  try {
    let query = req.query.q.split(' ');
    let type = query[0]; // album,artist,playlist,track
    query = encodeURIComponent(query.splice(1));
    console.log('type', type);
    console.log('query', query);
    performSearch(type, query).then(results => {
      fs = require('fs');
      fs.writeFile('test.txt', results);
      let uri = results.tracks.items[0].uri
      playOnSpotify(uri + ':autoplay');
      res.status(200).end();
    }).catch(reason => {
      console.log(reason);
      res.status(500).end();
    });
  } catch(e) {
    console.log(e);
    res.status(500).end();
  }
});

function requestAccessToken(code) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      uri: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + new Buffer(spotifyClientId + ':' + spotifyClientSecret).toString('base64')
      },
      json: true
    }, function(error, response, body) {
      if(error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

function speechToText() {
  let speechToText = new stt({
    username: '<username>',
    password: '<password>'
  });

  fs.createReadStream('./resources/speech.wav')
  .pipe(speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=44100' }))
  .pipe(fs.createWriteStream('./transcription.txt'));
}

function performSearch(type, query) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: 'https://api.spotify.com/v1/search' +
        '?type=' + type +
        '&q=' + query,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }, function(error, response, body) {
      if(error) {
        console.log(error);
        reject(error);
      } else {
        body = JSON.parse(body);
        resolve(body);
      }
    });
  });
}

function playOnSpotify(uri) {
  opn(uri);
}

app.listen(port, function() {
  console.log('Server listening');
});
