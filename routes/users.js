const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.get('/auth/signin', usersController.signinFunction);
router.get('/auth/signup', usersController.signupFunction);
router.post('/auth/create-user', usersController.createUser);
router.post('/auth/create-session', usersController.createSession);
router.get('/auth/logout', usersController.logout);

module.exports = router;