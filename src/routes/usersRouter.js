const express = require('express');

const router = express.Router();
const usersController = require("../controllers/usersController");

router.get('/:userId', usersController.getUser);
router.get('/:userId/audios', usersController.getUserAudios);
router.get('/:userId/following', usersController.getUserFollowings);
router.get('/:userId/followers', usersController.getUserFollowers);
router.patch('/:userId/follow', usersController.followUser);
router.patch('/:userId/unfollow', usersController.unfollowUser);

module.exports = router;