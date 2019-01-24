const request = require('supertest');
const {expect} = require('chai');
const sinon = require('sinon');
const app = require('../app');
const User = require('../models/User');

describe('App', () => {
  const cookies = [];
  before(() => {
    // hash = "password"
    const hash = '$2b$10$plczaXPsHHRZqx/yxhG8IuhWeLOF3T1dPG4s2b4VpeX1pigCnJ5vm';
    const user = new User('test', hash);
    sinon.stub(User, 'find').callsFake(() => user);
  });

  describe('GET /', () => {
    it('renders the homepage', (done) => {
      request(app)
          .get('/')
          .expect(200)
          .end((err, res) => {
            if (err) throw err;
            done();
          });
    });
  });

  describe('GET /home', () => {
    // .agent create a copy of SuperAgent that saves cookies
    const authenticated = request.agent(app);
    before((done) => {
      authenticated
          .post('/login')
          .send('email=test')
          .send('password=password')
          .end((err, response) => {
            expect(response.statusCode).to.equal(302);
            expect('Location', '/home');
            done();
          });
    });

    it('redirects to the /signin route if user is unauthenticated ', (done) => {
      request(app)
          .get('/home')
          .expect(302)
          .end((err, res) => {
            if (err) throw err;
            expect(res.headers.location).to.equal('/signin');
            done();
          });
    });

    it('renders the home page if the user is authenticated', (done) => {
      authenticated
          .get('/home')
          .set('Cookie', cookies)
          .expect(200)
          .end((err) => {
            if (err) throw err;
            done();
          });
    });
  });

  describe('POST /login', () => {
    it('responds with Unauthorized for incorrect credentials', (done) => {
      request(app)
          .post('/login')
          .send('email=test')
          .send('password=wrong')
          .expect(401)
          .end((err, res) => {
            if (err) throw err;
            done();
          });
    });

    it('successfully signs in a user with correct credentials', (done) => {
      request(app)
          .post('/login')
          .send('email=test')
          .send('password=password')
          .expect(302)
          .end((err, res) => {
            if (err) throw err;
            expect(res.headers.location).to.equal('/home');
            done();
          });
    });
  });

  describe('GET /signin', () => {
    it('renders the signin page', (done) => {
      request(app)
          .get('/signin')
          .expect(200)
          .end((err, res) => {
            if (err) throw err;
            done();
          });
    });
  });

  describe('GET /signout', () => {
    it('signs a user out of their session', (done) => {
      request(app)
          .get('/signout')
          .expect(302)
          .end((err, res) => {
            if (err) throw err;
            expect(res.header.location).to.equal('/');
            done();
          });
    });
  });
});
