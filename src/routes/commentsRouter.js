const express = require('express');
const router = express.Router();

const { auth, schemaValidate } = require('../middlewares');
const { create } = require('../controllers/commentController');
const commentValidator = require('../validationSchemas/comment.validator');
router.post('/', schemaValidate(commentValidator.create), auth, create);

module.exports = router;
