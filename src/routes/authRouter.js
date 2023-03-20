const express = require('express');

const authController = require('../controllers/authController');
const { auth, schemaValidate } = require('../middlewares');
const authValidator = require('../validationSchemas/auth.validator');
const router = express.Router();

router.post(
  '/register',
  schemaValidate(authValidator.register),
  authController.register
);
router.post(
  '/login',
  schemaValidate(authValidator.login),
  authController.login
);
router.get('/profile', auth, authController.profile);
router.post('/logout', auth, authController.logout);

module.exports = router;
