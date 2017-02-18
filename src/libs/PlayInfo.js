const io = require('socket.io-client');

class PlayInfo {

  static connect() {
    return io.connect('http://localhost:3000');
  }

  static send(artistName, title) {
    const socket = this.connect();
    socket.emit('song', {
      artist: artistName,
      title,
    });
  }
}

module.exports = PlayInfo;
