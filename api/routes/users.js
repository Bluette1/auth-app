const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkJwt  = require('../middleware/check-jwt');

router.get('/:id', [checkJwt], UsersController.getOneById);
router.post('/', [], UsersController.newUser);


module.exports = router;
