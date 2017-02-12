const PlayMusic = require('playmusic');
const secret = require('../../config/secret.json');

const email = secret.email;
const password = secret.password;

class PlayList {

  constructor(pm, songs) {
    this.pm = pm;
    this.songs = songs;
  }

  static create() {
    const pm = new PlayMusic();
    return this.getAllTracks(pm)
      .then(songs => new PlayList(pm, songs));
  }

  static getAllTracks(pm) {
    return new Promise((resolve) => {
      console.log('Get all tracks.');

      pm.init({
        email,
        password,
      }, (err) => {
        if (err) throw err;

        pm.getAllTracks((getErr, library) => {
          if (getErr) throw getErr;

          console.log('all tracks length:', library.data.items.length);

          // Remove unused data
          const playList = library.data.items.map(item => ({
            id: item.id,
            artist: item.artist,
            title: item.title,
          }));

          resolve(playList);
        });
      });
    });
  }

  select() {
    return new Promise((resolve) => {
      console.log('Select songs.');

      const randomIndex = Math.floor(Math.random() * this.songs.length);
      const song = this.songs[randomIndex];

      console.log('song:', `${song.artist} ${song.title}`);

      resolve(this.getStreamUrl(song));
    });
  }

  getStreamUrl(song) {
    return new Promise((resolve) => {
      this.pm.getStreamUrl(song.id, (err, streamUrl) => {
        if (err) throw err;
        resolve(streamUrl);
      });
    });
  }
}

module.exports = PlayList;
