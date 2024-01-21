const bcrypt = require('bcrypt');

const encryptPassword = async (password) => {
  return await bcrypt.hash(password, 12)
}

const users = [
  { id: '1', username: 'JoyVibes', email: 'joyvibes@gmail.com', password: '$2b$12$UA6FMG3O4GyJvwkCTgQw5uZ1k7wTxFwAR8WD2lEXFIviktbh4Lo5G' },
  { id: '2', username: 'JourneyingOne', email: 'journeyingonene@gmail.com', password: '$2b$12$Kxtu/yL5oIuGa6hKoQNA3.QMu0wiiB4mGIdj2Xn8k2q0lmKTT1e6C' },
  { id: '3', username: 'BlankCheque', email: 'blankcheque@gmail.com', password: '$2b$12$kFY.K5zjPv91kTHVPTMYoulGOI7ptcNkLZhuAB2EYG7kEupX7.bF6' },
]

const getUserByEmail = (email) => {
  return users.find(user => user.email === email)
}

const findById = (id) => {
  return users.find(user => user.id === id)
}

const getUser = (id) => {
  return findById(id);
};

const isPasswordCorrect = async (id, password) => {
  const user = findById(id);
  if (!user) return false;

  return await bcrypt.compare(password, user.password);
};

const createUser = async (email, password, username) => {
  const user = {
    id: users.length + 1,
    email,
    password: await encryptPassword(password),
    username
  };

  users.push(user);

  return user;
};

module.exports = { createUser, isPasswordCorrect, findById, getUserByEmail, getUser }
