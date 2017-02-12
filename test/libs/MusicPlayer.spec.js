const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const childProcess = require('child_process');
const request = require('request');
const util = require('../util');

const PlayList = require(util.paths.PlayList);
const MusicPlayer = require(util.paths.MusicPlayer);

const sandbox = util.sandbox;

describe('MusicPlayer', () => {
  const playList = [{
    artist: 'test artist',
    title: 'test title',
    id: '1234567890',
  }, {
    artist: 'test artist 2',
    title: 'test title 2',
    id: '0987654321',
  }];

  const streamUrl = 'http://dummy/sream/1234567890';

  function mockPlayListCreate() {
    sandbox.stub(PlayList, 'create', () => Promise.resolve(new PlayList(null, playList)));
  }

  function mockPlayListSelect() {
    sandbox.stub(PlayList.prototype, 'select', () => Promise.resolve(streamUrl));
  }

  function mockRequest() {
    sandbox.stub(request, 'get', () => ({
      pipe(stream) {
        stream.end('done writing data');
      },
    }));
  }

  function mockPlayerPlay() {
    return sandbox.stub(childProcess, 'execFile', (cmd, args, options, cb) => {
      cb();
    });
  }

  describe('init', () => {
    it('should create MusicPlayer instance', () => {
      mockPlayListCreate();

      return MusicPlayer.init()
        .then((musicPlayer) => {
          expect(musicPlayer).be.an.instanceof(MusicPlayer);
          expect(musicPlayer.playList).be.an.instanceof(PlayList);
        });
    });

    it('should fail to create MusicPlayer instance', () => {
      sandbox.stub(PlayList, 'create', () => new Promise(() => {
        throw new Error('playlist create error');
      }));

      return expect(MusicPlayer.init()).eventually.rejectedWith('playlist create error');
    });
  });

  describe('play', () => {
    it('should call play on player', () => {
      mockPlayListCreate();
      mockPlayListSelect();
      mockRequest();
      const spyPlay = mockPlayerPlay();

      return MusicPlayer.init()
        .then(musicPlayer => musicPlayer.play())
        .then(() => {
          expect(spyPlay.calledOnce).to.equal(true);
        });
    });

    it('should fail to call play on player', () => {
      mockPlayListCreate();
      mockPlayListSelect();
      mockRequest();
      sandbox.stub(childProcess, 'execFile', (cmd, args, options, cb) => {
        cb(new Error('test play error'));
      });

      return expect(MusicPlayer.init().then(musicPlayer => musicPlayer.play()))
        .eventually.rejectedWith('test play error');
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});

