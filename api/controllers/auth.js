const { sign } = require('jsonwebtoken');
const config = require('../config');
const { getUserByEmail, isPasswordCorrect } = require('../state/users');
const normalizeEmail = require('normalize-email');
const createError = require('http-errors');

class AuthController {
  static login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!(email && password))
      return next(createError(400, 'Email and password are required'));

    const user = await getUserByEmail(normalizeEmail(email));

    if (!user) return next(createError(404, `User with email ${email} not found`))
    try {
      if (!await isPasswordCorrect(user.id, password)) {
        return next(createError(401, 'Email and password don\'t match'))
      }
    } catch (error) {
      return next(createError(404, error.message))
    }

    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      {
        expiresIn: '1h',
        notBefore: '0',
        algorithm: 'HS256',
      }
    );

    res.send({ token, user });
  };
}
module.exports = AuthController;
