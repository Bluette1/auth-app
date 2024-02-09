require('dotenv').config();

const defaultConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  port: process.env.PORT || 3001,
  mongo: {
    host: 'localhost',
    port: 27017,
    db: 'auth_app_db',
    uri: process.env.MONGO_URI,
  },
};

const env = process.env.NODE_ENV || 'development';

const config = require(`./${env}`);
const resConfig = Object.assign({ env }, defaultConfig, config);
module.exports = resConfig;
