const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')
const checkJwt = require('../middleware/check-jwt')
const checkUsername = require('../middleware/check-username')

router.get('/:id', [checkJwt], UsersController.getOneById)
router.post('/', [checkUsername], UsersController.newUser)

module.exports = router
