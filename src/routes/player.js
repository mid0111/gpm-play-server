const express = require('express');

const router = express.Router();

const MusicPlayer = require('../libs/MusicPlayer');
const Logger = require('../libs/Logger');

let player;

function initPlayer() {
  if (!player) {
    return MusicPlayer.init()
      .then((res) => {
        player = res;
      });
  }
  return Promise.resolve();
}

router.post('/', (req, res, next) => {
  initPlayer()
    .then(() => {
      player[req.body.action]();

      // response async
      res.json({
        action: req.body.action,
      }).send();
    })
    .catch((err) => {
      Logger.error(`Failed to ${req.body.action}`, err);
      next(err);
    });
});

module.exports = router;
