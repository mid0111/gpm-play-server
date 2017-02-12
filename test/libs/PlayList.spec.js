const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const PlayMusic = require('playmusic');
const util = require('../util');

const PlayList = require(util.paths.PlayList);

const sandbox = util.sandbox;

describe('PlayList', () => {
  const library = {
    data: {
      items: [{
        artist: 'test artist',
        title: 'test title',
        id: '1234567890',
      }, {
        artist: 'test artist 2',
        title: 'test title 2',
        id: '0987654321',
      }],
    },
  };

  const streamUrl = 'http://dummy/sream/1234567890';

  function mockPmInit() {
    sandbox.stub(PlayMusic.prototype, 'init', (options, cb) => {
      cb();
    });
  }

  function mockPmGetAllTracks() {
    sandbox.stub(PlayMusic.prototype, 'getAllTracks', (cb) => {
      cb(null, library);
    });
  }

  function mockPmStreamUrl() {
    sandbox.stub(PlayMusic.prototype, 'getStreamUrl', (id, cb) => {
      cb(null, streamUrl);
    });
  }

  describe('Create instance', () => {
    it('should create PlayList instance', () => {
      mockPmInit();
      mockPmGetAllTracks();

      return expect(PlayList.create()).eventually.be.an.instanceof(PlayList);
    });

    it('should fail to create PlayList instance', () => {
      mockPmInit();

      sandbox.stub(PlayMusic.prototype, 'getAllTracks', (cb) => {
        const err = new Error('test error');
        cb(err);
      });

      return expect(PlayList.create()).eventually.rejectedWith('test error');
    });
  });

  describe('select song', () => {
    it('should select song and return stream url', () => {
      mockPmInit();
      mockPmGetAllTracks();
      mockPmStreamUrl();

      return PlayList.create()
        .then(playList => playList.select())
        .then((res) => {
          expect(res).to.equal(streamUrl);
        });
    });

    it('should fail to select song', () => {
      mockPmInit();
      mockPmGetAllTracks();

      sandbox.stub(PlayMusic.prototype, 'getStreamUrl', (id, cb) => {
        const err = new Error('test getStreamUrl error');
        cb(err);
      });

      return expect(PlayList.create().then(playList => playList.select()))
        .eventually.rejectedWith('test getStreamUrl error');
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});

