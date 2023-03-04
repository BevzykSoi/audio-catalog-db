const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares');
const { create } = require('../controllers/commentController');

router.post('/', auth, create);

module.exports = router;
