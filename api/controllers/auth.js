const { sign } = require('jsonwebtoken');
const config  = require('../config');
const { getUserByEmail, isPasswordCorrect } = require('../state/users');
const normalizeEmail = require('normalize-email');

class AuthController {
    static login = async (req, res, next) => {
        const { email, password } = req.body;
        if (!(email && password))
            throw new ValidationError('Email and password are required');

        const user = getUserByEmail(normalizeEmail(email));

        if (!user || !(await isPasswordCorrect(user.id, password)))
            return res
                .status(401)
                .send({ code: 401, message: 'Email and password don\'t match' });

        const token = sign(
            { userId: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            {
                expiresIn: '1h',
                notBefore: '0',
                algorithm: 'HS256',
            }
        );

        res.send({ token, ...user });
    };
}
module.exports = AuthController ;
