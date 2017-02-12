const expect = require('chai').expect;
const util = require('../util');

const MusicPlayer = require(util.paths.MusicPlayer);

const request = util.request;

describe('/player', () => {
  before(() => {
    const mockPlayer = {
      play: () => Promise.resolve(),
      next: () => Promise.resolve(),
      stop: () => Promise.resolve(),
    };

    util.sandbox.stub(MusicPlayer, 'init', () => Promise.resolve(mockPlayer));
  });

  after(() => {
    util.sandbox.restore();
  });

  it('should respond 200 OK', (done) => {
    request
      .post('/player')
      .send({
        action: 'play',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.action).to.equal('play');
      })
      .end(done);
  });

  it('should respond 500', (done) => {
    request
      .post('/player')
      .send({
        action: 'notExist',
      })
      .expect('Content-Type', /json/)
      .expect(500)
      .end(done);
  });
});
