const express = require('express');

const authController = require('../controllers/authController');
const { auth } = require('../middlewares');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.profile);
router.post('/logout', auth, authController.logout);

module.exports = router;