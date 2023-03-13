const express = require('express');
const router = express.Router();
const userCotroller = require('../controllers/user.controllers');
const userCotroller = new userCotroller();

router.post('/signup', userCotroller.signupController);
router.post('/login', userCotroller.loginController);

module.exports = router;
