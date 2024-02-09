const { createUser, getUser } = require('../state/users')
const normalizeEmail = require('normalize-email')
const createError = require('http-errors')

class UsersController {
  static getOneById = async (req, res, next) => {
    const id = req.params.id

    const user = await getUser(id)
    if (!user) {
      return next(createError(404, `User with ID ${id} not found`))
    }
    res.status(200).send(user)
  }

  static newUser = async (req, res, next) => {
    const { email, password, username } = req.body
    if (!(email && password))
      return next(createError(400, 'Email and password are required'))

    let user
    try {
      user = await createUser(normalizeEmail(email), password, username)
      res.status(201).send(user)
    } catch (error) {
      next(createError(400, error.message))
    }
  }
}

module.exports = UsersController
