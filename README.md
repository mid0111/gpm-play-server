gpm-play-server
====

Server for random playing from your Google play music library.  
Make your audio system to be a Google play music client.  
Connect audio system with server, then you can listen on your audio system and operate (play, skip, stop...) from another machine through web UI!!

[![CircleCI](https://circleci.com/gh/mid0111/gpm-play-server/tree/master.svg?style=svg)](https://circleci.com/gh/mid0111/gpm-play-server/tree/master)

## Requirement

Gcm play server depends on [play-sound](https://github.com/shime/play-sound/blob/master/index.js).  
To play audio, require audio player like mpg321, mpg123, aplay, etc...  
See [play-sound options](https://github.com/shime/play-sound/blob/master/index.js) for more informations.

## Install

```bash
git clone https://github.com/mid0111/gpm-play-server.git
npm install

cp -p config/secret.json{.sample,}
vi config/secret.json

npm start
```

## Open web UI

* Access to http://localhost:3000
