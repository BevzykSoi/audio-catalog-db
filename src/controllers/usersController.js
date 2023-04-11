const { User, Profile, Audio } = require('../models');
const fs = require('fs').promises;
const Jimp = require('jimp');
const cloudinary = require('cloudinary').v2;

const path = require('path');
const avatarsPath = path.join(process.cwd(), 'public/avatars');
const bannersPath = path.join(process.cwd(), 'public/banners');

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'profile',
    });

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

    res.json(user);
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

    req.user.profile = await Profile.findByIdAndUpdate(
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

    if (!req.user.profile) {
      res.status(404).send('Profile did not found!');
      return;
    }

    await req.user.save();

    res.json(req.user);
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

    req.user.profile = await Profile.findByIdAndUpdate(
      req.user.profile.toString(),
      {
        avatarUrl: newAvatar.secure_url,
      },
      {
        new: true,
      }
    );

    if (!req.user.profile) {
      res.status(404).send('Profile did not found!');
      return;
    }

    await req.user.save();

    res.json(req.user);
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

    req.user.profile = await Profile.findByIdAndUpdate(
      req.user.profile.toString(),
      {
        banner: newBanner.secure_url,
      },
      {
        new: true,
      }
    );

    if (!req.user.profile) {
      res.status(404).send('Profile did not found!');
      return;
    }

    await req.user.save();

    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

exports.getUserAudios = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: 'createdAudios',
      populate: {
        path: 'author',
      },
    });

    let { page, perPage } = req.query;
    const searchFilter = {
      author: id,
    };

    if (!page) {
      page = 1;
    } else {
      page = +page;
    }
    if (!perPage) {
      perPage = 12;
    } else {
      perPage = +perPage;
    }

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

    const audios = await Audio.find(searchFilter, null, {
      limit: perPage,
      skip: (page - 1) * perPage,
    }).populate('author');

    const audiosCount = await Audio.count(searchFilter);

    res.json({
      items: audios,
      itemsCount: audiosCount,
      page,
      perPage,
      pagesCount: Math.ceil(audiosCount / perPage),
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
      populate: {
        path: 'author',
      },
    });

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }
    let { page, perPage } = req.query;

    const searchFilter = {
      usersLiked: id,
    };

    if (!page) {
      page = 1;
    } else {
      page = +page;
    }
    if (!perPage) {
      perPage = 12;
    } else {
      perPage = +perPage;
    }

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

    const audios = await Audio.find(searchFilter, null, {
      limit: perPage,
      skip: (page - 1) * perPage,
    }).populate('author');

    const audiosCount = await Audio.count(searchFilter);

    res.json({
      items: audios,
      itemsCount: audiosCount,
      page,
      perPage,
      pagesCount: Math.ceil(audiosCount / perPage),
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
      populate: {
        path: 'author',
      },
    });

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }
    
    res.json({
      items: user.history,
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

    await user.populate({
      path: 'profile',
    });

    res.json(user.following);
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

    let { page, perPage } = req.query;
    const searchFilter = {
      author: id,
    };

    if (!page) {
      page = 1;
    } else {
      page = +page;
    }
    if (!perPage) {
      perPage = 12;
    } else {
      perPage = +perPage;
    }

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

    const audios = await Audio.find(searchFilter, null, {
      limit: perPage,
      skip: (page - 1) * perPage,
    }).populate('author');

    const audiosCount = await Audio.count(searchFilter);

    res.json({
      items: audios,
      itemsCount: audiosCount,
      page,
      perPage,
      pagesCount: Math.ceil(audiosCount / perPage),
    });
  } catch (error) {
    next(error);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      res.status(400).send('You cannot follow yourself!');
      return;
    }

    let userToFollow = await User.findById(id);

    const isFollowing = req.user.following.includes(userToFollow.id);
    if (isFollowing) {
      userToFollow = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            followers: req.user.id,
          },
        },
        {
          new: true,
        }
      );

      req.user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            following: userToFollow._id,
          },
        },
        {
          new: true,
        }
      );
    } else {
      userToFollow = await User.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            followers: req.user.id,
          },
        },
        {
          new: true,
        }
      );

      req.user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: {
            following: userToFollow._id,
          },
        },
        {
          new: true,
        }
      );
    }

    await userToFollow.populate({
      path: 'profile',
    });

    await userToFollow.populate({
      path: 'following',
    });

    await userToFollow.populate({
      path: 'followers',
    });

    res.json(userToFollow);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).send('Not found!');
      return;
    }
    if (id !== req.user._id.toString()) {
      res.status(401).send('Not authorized!');
      return;
    }
    res.json({
      message: `User successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserPlaylists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'playlists',
    });

    if (!user) {
      res.status(404).send('User did not found!');
      return;
    }

    res.json(user.playlists);
  } catch (error) {
    next(error);
  }
};
