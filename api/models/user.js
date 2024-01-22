const mongoose = require('mongoose');

const checkEmail = (email) => {
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email);
};

const checkUsername = (username) => {
	const notPermitted = [
		'kill',
		'cutie',
		'cute', 'hate',
		'ass', 'fake',
		'beast', 'jerk',
		'smart', 'holy'
	]

	let permitted = true;

	notPermitted.forEach(word => {
		if (username.indexOf(word) !== -1) {
			permitted = false;
		}
	});
	return permitted;

}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: checkUsername,
        message: 'Username validation failed',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: checkEmail,
        message: 'Email validation failed',
      },
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
