const validateUsername = (username) => {
	const notPermitted = [
		'kill',
		'cutie',
		'cute', 'hate',
		'f***', 'sex',
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

