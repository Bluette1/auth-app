const bcrypt = require('bcrypt');
const User = require('../models/user');

const encryptPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email }).exec();
};

const findById = async (id) => {
  return await User.findById(id).exec();
};

const getUser = (id) => {
  const usr = findById(id);
  return usr;
};

const isPasswordCorrect = async (id, password) => {
  const user = await findById(id);
  if (!user) throw new Error(`User with ID ${id} not found`);

  return await bcrypt.compare(password, user.password);
};

const createUser = async (email, password, username) => {
  if (password.length < 8) throw new Error('Invalid password');

  const user = {
    email,
    password: await encryptPassword(password),
    username,
  };

  return await User.create(user);
};

module.exports = {
  createUser,
  isPasswordCorrect,
  findById,
  getUserByEmail,
  getUser,
};
