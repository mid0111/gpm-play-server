var gpm = gpm || {};

(function () {
  gpm.onPlay = function () {
    request('play');
  };

  gpm.onNext = function () {
    request('next');
  };

  gpm.onStop = function () {
    request('stop');
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
}());
