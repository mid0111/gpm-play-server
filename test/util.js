const path = require('path');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../src/app');

const paths = {
  PlayList: path.join(__dirname, '../src/libs/PlayList'),
  MusicPlayer: path.join(__dirname, '../src/libs/MusicPlayer'),
};

const sandbox = sinon.sandbox.create();

const request = supertest(app);

module.exports = {
  paths,
  sandbox,
  request,
};
