const { User, Profile } = require('../models');

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { language, theme, saveHistory } = req.body;

    if (id !== req.user._id.toString()) {
      res.status(401).send('Not authorized!');
      return;
    }

    const userProfile = await Profile.findByIdAndUpdate(req.user.profile.toString(), {
      language,
      theme,
      saveHistory,
    }, {
      new: true,
    });

    if (!userProfile) {
      res.status(404).send('Product did not found!');
      return;
    }

    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    if (id !== req.user._id.toString()) {
      res.status(401).send('Not authorized!');
      return;
    }

    //TO-DO
  } catch (error) {
    next(error);
  }
};

exports.updateUserBanner = async (req, res, next) => {
  try {
    //TO-DO
  } catch (error) {
    next(error);
  }
};

exports.getUserAudios = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'createdAudios',
    });

    res.json({
      "User's audios": user.createdAudios,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserLikes = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'likedAudios',
    });

    res.json({
      "User's likes": user.likedAudios,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'history',
    });

    res.json({
      "User's history": user.history,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserFollowings = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'following',
    });

    res.json({
      "User's followings": user.following,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserFollowers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'followers',
    });

    res.json({
      "User's followers": user.followers,
    });
  } catch (error) {
    next(error);
  }
};

exports.followUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
