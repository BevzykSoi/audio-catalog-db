const { Comment } = require('../models/index');

exports.create = async (req, res, next) => {
  try {
    const { text, audio, replyTo } = req.body;

    const comment = await Comment.create({
      text,
      audio,
      owner: req.user._id,
      replyTo,
    });

    await comment.populate({
      path: 'audio',
    });

    await comment.populate({
      path: 'owner',
    });

    await comment.populate({
      path: 'replyTo',
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};
