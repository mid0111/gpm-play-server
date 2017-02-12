var fs = require('fs-extra');
var path = require('path');
var request = require('request');
var player = require('play-sound')(opts = {});

var PlayList = require('./PlayList');

var tmpFolder = path.join(__dirname, '../tmp');
var tmpFilePath = path.join(tmpFolder, 'playing.mp3');

class MusicPlayer {

  constructor(playList) {
    this.playList = playList;
  }

  static init() {
    // Create download directory when it does not exist.
    fs.mkdirsSync(tmpFolder);

    // Create instance
    return PlayList.create()
      .then((playList) => new MusicPlayer(playList));
  }

  play() {
    return this.playList.select()
      .then(this._downloadMusicFile)
      .then(this._play);
  }

  _downloadMusicFile(streamUrl) {
    return new Promise((resolve) => {
      var writeStream = fs.createWriteStream(tmpFilePath);
      writeStream.on('finish', () => {
        return resolve(tmpFilePath);
      });
      request.get(streamUrl).pipe(writeStream);
    });
  }

  _play() {
    return new Promise((resolve, reject) => {
      console.log('im playing...');

      player.play(tmpFilePath, (err)=> {
        if(err) reject(err);

        console.log('play done, switching to next one ...');
        return resolve();
      });
    });
  }
}

module.exports = MusicPlayer;
