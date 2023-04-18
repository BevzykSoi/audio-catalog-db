const { Comment, Notification } = require('../models/index');

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

    const notification = await Notification.create({
      owner: comment.audio.author,
      target: comment,
      targetModel: 'comment',
      type: 'AUDIO_COMMENT',
      user: req.user._id,
    });

    await notification.populate('owner');
    notification.owner.notifications.push(notification);
    await notification.owner.save();

    await notification.populate({
      path: 'target',
      populate: 'audio',
    });
    await notification.populate({
      path: 'user',
      populate: {
        path: 'profile',
      },
    });

    req.io
      .to(comment.audio.author.valueOf())
      .emit('new_notification', notification.toJSON());

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};
