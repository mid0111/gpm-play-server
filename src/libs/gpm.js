// sample play

const MusicPlayer = require('./MusicPlayer');

MusicPlayer.init()
  .then((player) => {
    player.play();

    setTimeout(() => {
      player.next();
      setTimeout(() => {
        player.stop();
      }, 10000);
    }, 10000);
  });
