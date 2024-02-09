const checkUsername = (username) => {
  const notPermitted = [
    'kill',
    'cutie',
    'cute',
    'hate',
    'ass',
    'fake',
    'beast',
    'jerk',
    'smart',
    'holy',
  ]

  let permitted = true

  notPermitted.forEach((word) => {
    if (username.indexOf(word) !== -1) {
      permitted = false
    }
  })
  return permitted
}

const verifyUsername = (req, res, next) => {
  const username = req.body.username
  const permitted = checkUsername(username)
  if (!permitted) {
    return res.status(400).send({
      code: 400,
      message: 'Username validation failed: forbidden word(s)',
    })
  }

  next()
}

module.exports = verifyUsername
