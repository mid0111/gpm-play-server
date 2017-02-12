var path = require('path');
var sinon = require('sinon');

var paths = {
  PlayList: path.join(__dirname, '../src/libs/PlayList'),
  MusicPlayer: path.join(__dirname, '../src/libs/MusicPlayer')
};

var sandbox = sinon.sandbox.create();

module.exports = {
  paths,
  sandbox
};
