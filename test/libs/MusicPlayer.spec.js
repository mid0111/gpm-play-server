var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;

var child_process    = require('child_process');
var request = require('request');

var util = require('../util');
var PlayList = require(util.paths.PlayList);
var MusicPlayer = require(util.paths.MusicPlayer);

var sandbox = util.sandbox;

describe('MusicPlayer', () => {
  var playList = [{
    artist: 'test artist',
    title: 'test title',
    id: '1234567890'
  }, {
    artist: 'test artist 2',
    title: 'test title 2',
    id: '0987654321'
  }];

  var streamUrl = 'http://dummy/sream/1234567890';

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
      sandbox.stub(PlayList, 'create', () => {
        return new Promise(() => {
          throw new Error('playlist create error');
        });
      });

      return expect(MusicPlayer.init()).eventually.rejectedWith('playlist create error');
    });
  });

  describe('play', () => {
    it('should call play on player', () => {
      mockPlayListCreate();
      mockPlayListSelect();
      mockRequest();
      var spyPlay = mockPlayerPlay();

      return MusicPlayer.init()
        .then((musicPlayer) => musicPlayer.play())
        .then(() => {
          expect(spyPlay.calledOnce).to.equal(true);
        });
    });

    it('should fail to call play on player', () => {
      mockPlayListCreate();
      mockPlayListSelect();
      mockRequest();
      sandbox.stub(child_process, 'execFile', (cmd, args, options, cb) => {
        cb(new Error('test play error'));
      });

      return expect(MusicPlayer.init().then((musicPlayer) => musicPlayer.play()))
        .eventually.rejectedWith('test play error');
    });

  });

  afterEach(() => {
    sandbox.restore();
  });

  function mockPlayListCreate() {
    sandbox.stub(PlayList, 'create', () => {
      return Promise.resolve(new PlayList(null, playList));
    });
  }

  function mockPlayListSelect() {
    sandbox.stub(PlayList.prototype, 'select', () => {
      return Promise.resolve(streamUrl);
    });
  }

  function mockRequest() {
    sandbox.stub(request, 'get', () => {
      return {
        pipe: function(stream) {
          stream.end('done writing data');
        }
      };
    });
  }

  function mockPlayerPlay() {
    return sandbox.stub(child_process, 'execFile', (cmd, args, options, cb) => {
      cb();
    });
  }
});

