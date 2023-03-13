const express = require('express');
const router = express.Router();
const customerCotroller = require('../controllers/customer.controllers');
const customerCotroller = new customerCotroller();

router.post('/signup', customerCotroller.signupController);
router.post('/signup', customerCotroller.loginController);

module.exports = router;
