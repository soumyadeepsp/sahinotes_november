const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');

router.get('/auth/signin', usersController.signinFunction);
router.get('/auth/signup', usersController.signupFunction);
router.post('/auth/create-user', usersController.createUser);
router.post('/auth/create-session', usersController.createSession);
router.get('/auth/logout', usersController.logout);
router.get('/profile/:user_id', usersController.profile);
router.get('/auth/mobile-verify/:user_id', usersController.mobileVerify);
router.post('/auth/mobile/sendotp', usersController.sendOtp);

module.exports = router;