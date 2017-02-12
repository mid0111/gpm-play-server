// sample play

const MusicPlayer = require('./MusicPlayer');

MusicPlayer.init()
  .then(player => player.play());
