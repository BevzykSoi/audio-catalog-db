const express = require('express');

const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const audiosRouter = require('./audiosRouter');
const commentsRouter = require('./commentsRouter');
const router = express.Router();

router.use('/auth', authRouter);                                                                                                                                                  
router.use('/users', usersRouter);
router.use('/audios', audiosRouter);                                                                                                                        
router.use('/comments', commentsRouter);                                                                                                                        
module.exports = router;                                                                                                                                                                                                                                                                                                                                                 