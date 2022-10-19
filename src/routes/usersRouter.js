const express = require('express');

const router = express.Router();
const usersController = require("../controllers/usersController");
const { auth } = require('../middlewares');

router.get('/:id', usersController.getUser);
router.put('/:id', auth, usersController.updateUser);
router.patch('/:id/avatar', auth, usersController.updateUserAvatar);
router.patch('/:id/banner', auth, usersController.updateUserBanner);
router.get('/:id/audios', usersController.getUserAudios);
router.get('/:id/likes', usersController.getUserLikes);
router.get('/:id/history', usersController.getUserHistory);
router.get('/:id/following', usersController.getUserFollowings);
router.get('/:id/followers', usersController.getUserFollowers);
router.patch('/:id/follow', auth, usersController.followUser);

module.exports = router;