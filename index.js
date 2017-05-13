'use strict';

// External modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
// Configuration module
const config = require('./config');
// Proprietary modules
const microphone = require('./microphone');
const hotword = require('./hotword');
const music = require('./music');
const speechToText = require('./speech-to-text');

const app = express();
app.use(bodyParser.json());

app.get('/login', function(req, res) {
  let scopes = 'playlist-read-private playlist-read-collaborative user-follow-read user-library-read user-read-private user-top-read';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + config.spotifyClientId +
    '&scope=' + encodeURIComponent(scopes) +
    '&redirect_uri=' + encodeURIComponent(config.redirectUri));
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

microphone.record;
microphone.inputStream.pipe(hotword.detector);

app.listen(config.port, function() {
  console.log('Server listening');
});
