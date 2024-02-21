const expect = require('chai').expect;
const request = require('supertest');
const normalizeEmail = require('normalize-email');
const app = require('../../app');
const User = require('../../models/user');

describe('Authentication works', function () {
  const user = {
    email: 'jomica.smith@gmail.com',
    username: 'Jomica Smith',
    password: 'password4',
  };

  let userId;
  let token;

  before(function (done) {
    request(app)
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.username).to.be.equal(user.username);
        expect(res.body.email).to.be.equal(normalizeEmail(user.email));
        userId = res.body._id;
        return done();
      });
  });

  it('A registered user is able to login successfully', function (done) {
    request(app)
      .post('/login')
      .send({ email: user.email, password: user.password })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user');

        token = res.body.token;

        return done();
      });
  });

  it('A registered user is retrieved successfully', function (done) {
    request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.username).to.equal(user.username);

        expect(res.body.email).to.equal(normalizeEmail(user.email));
        return done();
      });
  });

  after(async function () {
    await User.deleteOne({ username: user.username });
  });
});
