const request = require('supertest');
const app = require('../app');

describe('App', () => {
  it('listens', (done) => {
    request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          done();
        });
  });
});
