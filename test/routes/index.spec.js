const util = require('../util');

const request = util.request;

describe('/', () => {
  it('should respond 200 OK', (done) => {
    request
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(done);
  });

  it('should respond 404', (done) => {
    request
      .put('/')
      .expect('Content-Type', /json/)
      .expect(404)
      .end(done);
  });
});
