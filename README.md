# Raspberry Pi Home Automation System (PiHAS)

## Installation

1. Clone the repository
```bash
git clone https://github.com/JorisPalings/pihas-api.git
```

2. Move into the repository's root directory
```bash
cd pihas-api
```

3. Install the repository's dependencies
```javascript
npm install
```

4. Create `config.js` in the repository's root directory
```bash
sudo nano config.js
```

5. Add your own [Watson Speech-to-Text API](https://www.ibm.com/watson/developercloud/speech-to-text.html "Watson Speech-to-Text API") and [Spotify API](https://developer.spotify.com/web-api/ "Spotify API") credentials
```json
'use strict';

const config = new function() {
  this.port = 3000;
  this.speechToTextUsername = "Watson Speech-to-Text API username";
  this.speechToTextPassword = "Watson Speech-to-Text API password";
  this.spotifyClientId = "Spotify client ID";
  this.spotifyClientSecret = "Spotify client secret";
  this.redirectUri = "http://localhost:" + this.port + "/auth";
}

module.exports = config;
```
