var PlayMusic = require('playmusic');
var player = require('play-sound')(opts = {});
var request = require('request');
var fs = require('fs-extra');
var path = require('path');

var secret = require('./config/secret.json');
var email = secret.email;
var password = secret.password;

var tmpFolder = path.join(__dirname, 'tmp');
var tmpFilePath = path.join(tmpFolder, 'playing.mp3');

var pm = new PlayMusic();

var playList;

// Create download directory when it does not exist.
fs.mkdirsSync(tmpFolder);

// Get play list from google play music and play forever...
getPlayList()
  .then(() => playMusics())
  .catch((err) => console.error('err', err.stack));

function playMusics() {
  return playMusic()
    .then(() => playMusics());
}

function playMusic() {
  return selectSong(playList)
    .then((song) => getStreamUrl(song))
    .then((url) => {
      return new Promise((resolve) => {
        var writeStream = fs.createWriteStream(tmpFilePath);
        writeStream.on('finish', () => {
          return resolve(tmpFilePath);
        });
        request(url).pipe(writeStream);

      });
    })
    .then((filepath) => play(filepath));
}

function play(filepath) {
  return new Promise((resolve, reject) => {
    console.log('im playing...');

    player.play(filepath, (err)=> {
      if(err) reject(err);

      console.log('play done, switching to next one ...');
      return resolve();
    });
  });
}

function getPlayList() {
  return getAllTracks()
    .then((songs) => playList = songs);
}

function getAllTracks() {
  var playList = [];

  return new Promise((resolve) => {
    console.log('Get all tracks.');

    pm.init({
      email: email,
      password: password
    }, (err, res) => {
      if(err) throw err;

      pm.getAllTracks((err, library) => {
        if(err) throw err;

        console.log('all tracks length:', library.data.items.length);
        resolve(library.data.items);
      });
    });

  });
};

function selectSong(songs) {
  return new Promise((resolve) => {
    console.log('Select songs.');

    var randomIndex = Math.floor(Math.random() * songs.length);
    var song = songs[randomIndex];

    console.log('song:', `${song.artist} ${song.title}`);

    resolve(song);
  });
}

function getStreamUrl(song) {
  return new Promise((resolve) => {
    pm.getStreamUrl(song.id, (err, streamUrl) => {
      if(err) throw err;
      resolve(streamUrl);
    });
  });
}
