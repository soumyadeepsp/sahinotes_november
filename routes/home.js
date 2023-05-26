const express = require('express');
const router = express.Router();

const homeController = require('../controllers/HomeController');
const usersController = require('../controllers/UsersController');

router.get('/home', homeController.homeFunction);
router.get('/signin', usersController.signinFunction);
router.use('/users', require('./users'));
router.use('/notes', require('./notes'));
router.use('/comments', require('./comments'));

module.exports = router;