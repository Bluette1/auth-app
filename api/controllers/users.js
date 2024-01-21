const { createUser, getUser} = require('../state/users');
const normalizeEmail = require('normalize-email');

class UsersController {

  static getOneById = async (req, res, next) => {
    const id = req.params.id;
    const user = getUser(id);
    res.status(200).send(user);
  };

  static newUser = async (req, res, next) => {
    const { email, password, username } = req.body;
    let user;
    try {
      user = await createUser(
        normalizeEmail(email),
        password,
        username
      );
      res.status(201).send(user);
    } catch (error) {
      return res
        .status(400)
        .send({ code: 400, message: JSON.stringify(error) });
    }
  };
}

module.exports = UsersController;