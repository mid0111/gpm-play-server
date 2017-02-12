const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Google play music player',
  });
});

router.use('/player', require('./player.js'));

module.exports = router;
