const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkJwt  = require('../middleware/check-jwt');

/* GET users listing. */
router.get('/:id', [checkJwt], UsersController.getOneById);

module.exports = router;
