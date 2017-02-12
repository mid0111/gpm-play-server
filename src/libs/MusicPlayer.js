const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const player = require('play-sound')({});

const Logger = require('./Logger');
const PlayList = require('./PlayList');

const tmpFolder = path.join(__dirname, '../tmp');
const tmpFilePath = path.join(tmpFolder, 'playing.mp3');

class MusicPlayer {

  constructor(playList) {
    this.playList = playList;
  }

  static init() {
    // Create download directory when it does not exist.
    fs.mkdirsSync(tmpFolder);

    // Create instance
    return PlayList.create()
      .then(playList => new MusicPlayer(playList));
  }

  play() {
    return this.playList.select()
      .then(MusicPlayer.downloadMusicFile)
      .then(MusicPlayer.startPlayer);
  }

  static downloadMusicFile(streamUrl) {
    return new Promise((resolve) => {
      const writeStream = fs.createWriteStream(tmpFilePath);
      writeStream.on('finish', () => resolve(tmpFilePath));
      request.get(streamUrl).pipe(writeStream);
    });
  }

  static startPlayer() {
    return new Promise((resolve, reject) => {
      Logger.info('im playing...');

      player.play(tmpFilePath, (err) => {
        if (err) {
          Logger.error('Failed to start player.', err);
          reject(err);
        }

        Logger.info('play done, switching to next one ...');
        return resolve();
      });
    });
  }
}

module.exports = MusicPlayer;
