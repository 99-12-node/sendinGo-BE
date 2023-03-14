const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const userController = new userCotroller();

router.post('/signup', userController.createUser);
// router.post('/signup/existemail', userController.signupUser);
// router.post('/signup/existcompany', userController.signupUser);
router.post('/login', userController.loginUser);
// router.patch('/:userId', userController.editUser);
// router.delete('/:userId', userController.deleteUser);

module.exports = router;
