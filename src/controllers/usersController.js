const { User, Profile } = require('../models');
const fs = require('fs').promises;
const Jimp = require('jimp');
const cloudinary = require('cloudinary').v2;

const path = require('path');
const avatarsPath = path.join(process.cwd(), 'public/avatars');
const audiossPath = path.join(process.cwd(), 'public/audios');
const bannersPath = path.join(process.cwd(), 'public/banners');

exports.getUser = async(req, res, next) => {
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

exports.updateUser = async(req, res, next) => {
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

exports.updateUserAvatar = async(req, res, next) => {
    try {
        const { id } = req.params;

        if (id !== req.user._id.toString()) {
            res.status(401).send('Not authorized!');
            return;
        }

        console.log(req.file);

        const uploadedImage = await Jimp.read(req.file.path);
        const editedImagePath = path.join(avatarsPath, req.file.filename);
        await uploadedImage
            .resize(128, 128)
            .quality(50)
            .circle()
            .writeAsync(editedImagePath);
        await fs.unlink(req.file.path);
        const uploadResponse = await cloudinary.uploader.upload(editedImagePath);


        const user = await User.findById(id);
        user.profile.avatarUrl = uploadResponse;
        await user.save();

        res.json(user.profile);
    } catch (error) {
        next(error);
    }
};

exports.updateUserBanner = async(req, res, next) => {
    try {
        //TO-DO
    } catch (error) {
        next(error);
    }
};

exports.getUserAudios = async(req, res, next) => {
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

exports.getUserLikes = async(req, res, next) => {
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

exports.getUserHistory = async(req, res, next) => {
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

// exports.getUserFollowings = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id).populate({
//       path: 'following',
//     });

//     res.json({
//       "User's followings": user.following,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getUserFollowers = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id).populate({
//       path: 'followers',
//     });

//     res.json({
//       "User's followers": user.followers,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.followUser = async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// };

router.post("/user/:id/follow-user", passport.authenticate("jwt", { session: false }), (req, res) => {

    // check if the requested user and :user_id is same if same then 

    if (req.user.id === req.params.user_id) {
        return res.status(400).json({ alreadyfollow: "You cannot follow yourself" })
    }

    User.findById(req.params.user_id)
        .then(user => {
            if (user.followers.filter(follower =>
                    follower.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ alreadyfollow: "You already followed the user" })
            }

            user.followers.unshift({ user: req.user.id });
            user.save()
            User.findOne({ email: req.user.email })
                .then(user => {
                    user.following.unshift({ user: req.params.user_id });
                    user.save().then(user => res.json(user))
                })
                .catch(err => res.status(404).json({ alradyfollow: "you already followed the user" }))
        })
})