const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');
const request = require('request');
const player = require('play-sound')({});

const Logger = require('./Logger');
const PlayList = require('./PlayList');

const tmpFolder = path.join(__dirname, '../tmp');
const tmpFilePath = path.join(tmpFolder, 'playing.mp3');

class MusicPlayer {

  constructor(playList) {
    this.playList = playList;
    this.event = new EventEmitter();

    this.event.on('play', () => {
      this.play();
    });

    this.event.on('stop', () => {
      if (this.process) {
        this.process.kill();
      }
    });

    this.event.on('next', () => {
      this.event.emit('stop');
      this.event.emit('play');
    });
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
      .then(() => this.startPlayer());
  }

  next() {
    this.event.emit('next');
  }

  stop() {
    this.event.emit('stop');
  }

  static downloadMusicFile(streamUrl) {
    return new Promise((resolve) => {
      const writeStream = fs.createWriteStream(tmpFilePath);
      writeStream.on('finish', () => resolve(tmpFilePath));
      request.get(streamUrl).pipe(writeStream);
    });
  }

  startPlayer() {
    return new Promise((resolve, reject) => {
      Logger.info('im playing...');

      this.process = player.play(tmpFilePath, (err) => {
        if (err && !err.killed) {
          Logger.error('Failed to start player.', err);
          reject(err);
        }

        Logger.info('play done.');
        return resolve();
      });
    });
  }
}

module.exports = MusicPlayer;
