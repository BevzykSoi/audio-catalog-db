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
      res.status(404).send('Profile did not found!');
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
  } catch (error) {
    next(error);
  }
};
