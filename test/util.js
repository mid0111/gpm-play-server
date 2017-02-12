const path = require('path');
const sinon = require('sinon');

const paths = {
  PlayList: path.join(__dirname, '../src/libs/PlayList'),
  MusicPlayer: path.join(__dirname, '../src/libs/MusicPlayer'),
};

const sandbox = sinon.sandbox.create();

module.exports = {
  paths,
  sandbox,
};
