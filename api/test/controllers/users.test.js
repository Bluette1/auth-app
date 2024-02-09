const expect = require('chai').expect
const request = require('supertest')
const normalizeEmail = require('normalize-email')
const app = require('../../app')
const User = require('../../models/user')

describe('POST /users', function () {
  const user = {
    email: 'jomica.smith@gmail.com',
    username: 'Jomica Smith',
    password: 'password4',
  }
  it('A user is created successfully', function (done) {
    request(app)
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.body.username).to.be.equal(user.username)
        expect(res.body.email).to.be.equal(normalizeEmail(user.email))
        return done()
      })
  })

  it("A user's username should be unique ", function (done) {
    request(app)
      .post('/users')
      .send({
        email: 'someemail@gmail.com',
        username: user.username,
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        const {
          error: { message },
        } = res.body
        expect(message).to.contain('duplicate key')

        return done()
      })
  })

  it("A user's email should be unique ", function (done) {
    request(app)
      .post('/users')
      .send({
        email: user.email,
        username: 'Yanny Smith',
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        const {
          error: { message },
        } = res.body
        expect(message).to.contain('duplicate key')

        return done()
      })
  })

  it("A user's username should not contain forbidden words ", function (done) {
    request(app)
      .post('/users')
      .send({
        email: 'johny.smith@gmail.com',
        username: 'superjerk',
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        const { message } = res.body
        expect(message).to.equal(
          'Username validation failed: forbidden word(s)'
        )

        return done()
      })
  })

  after(async function () {
    await User.deleteOne({ username: user.username })
  })
})
