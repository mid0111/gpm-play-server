var gpm = gpm || {};

(function () {
  var artistName = $('#artist-name');
  var musicTitle = $('#music-title');

  gpm.onPlay = function () {
    request('play');
  };

  gpm.onNext = function () {
    request('next');
  };

  gpm.onStop = function () {
    request('stop');
    artistName.text('');
    musicTitle.text('');
  };

  function request(action) {
    fetch('/player', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
      }),
    });
  }

  var baseUrl = location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/";
  var socket = io(baseUrl);
  socket.on('song', function (data) {
    artistName.text(data.artist);
    musicTitle.text(data.title);
  });
}());