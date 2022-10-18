const express = require('express');

const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

module.exports = router;