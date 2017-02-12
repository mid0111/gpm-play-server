// sample play

var MusicPlayer = require('./MusicPlayer');

MusicPlayer.init()
  .then((player) => player.play());
