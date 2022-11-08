const express = require('express');

const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const audiosRouter = require('./audiosRouter');
const router = express.Router();

router.use('/auth', authRouter);                                                                                                                                                  
router.use('/users', usersRouter);
router.use('/audios', audiosRouter);                                                                                                                            
module.exports = router;                                                                                                                                                                                                                                                                                                                                                 