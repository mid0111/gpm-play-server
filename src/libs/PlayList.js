var PlayMusic = require('playmusic');
var request = require('request');
var fs = require('fs-extra');
var path = require('path');

var secret = require('../../config/secret.json');
var email = secret.email;
var password = secret.password;

class PlayList {

  constructor(pm, songs) {
    this.pm = pm;
    this.songs = songs;
  }

  static create() {
    var pm = new PlayMusic();
    return this.getAllTracks(pm)
      .then((songs) => new PlayList(pm, songs));
  }

  static getAllTracks(pm) {
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
  }

  select() {
    return new Promise((resolve) => {
      console.log('Select songs.');

      var randomIndex = Math.floor(Math.random() * this.songs.length);
      var song = this.songs[randomIndex];

      console.log('song:', `${song.artist} ${song.title}`);

      resolve(this.getStreamUrl(song));
    });
  }

  getStreamUrl(song) {
    return new Promise((resolve) => {
      this.pm.getStreamUrl(song.id, (err, streamUrl) => {
        if(err) throw err;
        resolve(streamUrl);
      });
    });
  }
}

module.exports = PlayList;
