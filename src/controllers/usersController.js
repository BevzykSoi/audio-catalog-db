const { User, Profile } = require('../models');
const fs = require('fs').promises;
const Jimp = require('jimp');
const cloudinary = require('cloudinary').v2;

const path = require('path');
const avatarsPath = path.join(process.cwd(), 'public/avatars');
const bannersPath = path.join(process.cwd(), 'public/banners');

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

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

    const userProfile = await Profile.findByIdAndUpdate(
      req.user.profile.toString(),
      {
        language,
        theme,
        saveHistory,
      },
      {
        new: true,
      }
    );

    if (!userProfile) {
      res.status(404).send('User did not found!');
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

    if (id !== req.user._id.toString()) {
      res.status(401).send('Not authorized!');
      return;
    }

    const uploadedImage = await Jimp.read(req.file.path);
    const editedImagePath = path.join(avatarsPath, req.file.filename);
    await uploadedImage
      .resize(128, 128)
      .quality(70)
      .circle()
      .writeAsync(editedImagePath);
    const newAvatar = await cloudinary.uploader.upload(editedImagePath);
    await fs.unlink(req.file.path);

    const userProfile = await Profile.findByIdAndUpdate(
      req.user.profile.toString(),
      {
        banner: newAvatar.secure_url,
      },
      {
        new: true,
      }
    );

    if (!userProfile) {
      res.status(404).send('Profile did not found!');
      return;
    }

    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

exports.updateUserBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user._id.toString()) {
      res.status(401).send('Not authorized!');
      return;
    }

    const uploadedImage = await Jimp.read(req.file.path);
    const editedImagePath = path.join(bannersPath, req.file.filename);
    await uploadedImage.quality(70).writeAsync(editedImagePath);
    const newBanner = await cloudinary.uploader.upload(editedImagePath);
    await fs.unlink(req.file.path);

    const userProfile = await Profile.findByIdAndUpdate(
      req.user.profile.toString(),
      {
        banner: newBanner.secure_url,
      },
      {
        new: true,
      }
    );

    if (!userProfile) {
      res.status(404).send('Profile did not found!');
      return;
    }

    res.json(userProfile);
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

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

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

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

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

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

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

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

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

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

    res.json({
      "User's followers": user.followers,
    });
  } catch (error) {
    next(error);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    // User.findById(req.params.user_id)
    //     .then(user => {
    //         if (user.followers.filter(follower =>
    //                 follower.user.toString() === req.user.id).length > 0) {
    //             return res.status(400).json({ alreadyfollow: "You already followed the user" })
    //         }
    //         user.followers.unshift({ user: req.user.id });
    //         user.save()
    //         User.findOne({ email: req.user.email })
    //             .then(user => {
    //                 user.following.unshift({ user: req.params.user_id });
    //                 user.save().then(user => res.json(user))
    //             })
    //             .catch(err => res.status(404).json({ alradyfollow: "you already followed the user" }))
    //     })
  } catch (error) {
    next(error);
  }
};