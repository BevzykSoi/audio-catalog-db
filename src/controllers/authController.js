const bcrypt = require('bcrypt');

const jwt = require('../utils/jwt');
const { User, Profile } = require('../models');

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      res.status(422).send('Username already in use!');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    const payload = {
      _id: user.id,
    };
    const token = jwt.generateJwt(payload);

    const newProfile = await Profile.create({
      user: user._id,
    });

    user.profile = newProfile._id;
    await user.save();

    res.json({
        "message": "You've been signed up!",
        "token": token,
        user,
        "user's profile": newProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      res.status(400).send('Username or password is wrong!');
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).send('Username or password is wrong!');
      return;
    }

    const payload = {
      _id: user.id,
    };
    const token = jwt.generateJwt(payload);

    const profile = await Profile.findById(user.profile);

    res.json({
      message: "You've been logged in!",
      token: token,
      user,
      "user's profile": profile,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.json({
      "message": "You've been logged out!",
    });
  } catch (error) {
    next(error);
  }
};

exports.profile = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send('Not authorized!');
      return;
    }

    const profile = await Profile.findById(req.user.profile);

    res.json({
      message: 'You are in your profile!',
      "user": req.user,
      "user's profile": profile,
    });
  } catch (error) {
    next(error);
  }
};