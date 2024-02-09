const { verify } = require('jsonwebtoken')
const config = require('../config')
const { getUser } = require('../state/users')

const checkJwt = async (req, res, next) => {
  const token = req.headers.authorization
  let jwtPayload

  try {
    jwtPayload = await verify(token.split(' ')[1], config.jwt.secret, {
      complete: true,
      algorithms: ['HS256'],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    })
    const user = getUser(jwtPayload.payload.userId)
    req.user = user
  } catch (error) {
    return res
      .status(403)
      .send({ code: 403, message: 'Missing or invalid token' })
  }
  next()
}

module.exports = checkJwt
