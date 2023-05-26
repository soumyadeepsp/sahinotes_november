const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.get('/signin', usersController.signinFunction);
router.get('/signup', usersController.signupFunction);

module.exports = router;