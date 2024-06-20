const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require("../middleware/auth");
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', checkAuth, userController.getMe);

module.exports = router;
