'use strict';

// External module
const opn = require('opn');
// Configuration module
const config = require('./config');

var accessToken;

var requestAccessToken = function(code) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      uri: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + new Buffer(config.spotifyClientId + ':' + config.spotifyClientSecret).toString('base64')
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

var performSearch = function(type, query) {
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

var playOnSpotify = function(uri) {
  opn(uri);
}

module.exports.requestAccessToken = requestAccessToken;
module.exports.performSearch = performSearch;
module.exports.playOnSpotify = playOnSpotify;
