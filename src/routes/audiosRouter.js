const express = require('express');
const path = require('path');
const router = express.Router();

const { Audio, Profile } = require('../models');

const multer = require('multer');
const fs = require('fs').promises;
const Jimp = require('jimp');
const { number } = require('yup');
const { string } = require('yup/lib/locale');

const { auth, historyAuth } = require('../middlewares');

const audiosPath = path.join(process.cwd(), 'public/audios');
const audioController = require('../controllers/audioController');
const paginationMiddleware = require('../middlewares/paginationmidd');

const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audiosPath);
  },
  filename: (req, file, cb) => {
    const newFileName = `${new Date().getTime()}_${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({
  storage,
});
router.post(
  '/',
  auth,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const audioPath = req.files.audio[0].path;
      const coverPath = req.files.cover[0].path;

      const audioUploadResponse = await cloudinary.uploader.upload(audioPath, {
        resource_type: 'video',
      });
      const coverUploadResponse = await cloudinary.uploader.upload(coverPath);

      await fs.unlink(audioPath);
      await fs.unlink(coverPath);

      await req.user.populate({
        path: 'profile',
      });

      req.user.profile = await Profile.findByIdAndUpdate(
        req.user.profile._id,
        {
          $addToSet: {
            genres: { $each: req.body.genres.split(', ') },
          },
        },
        {
          new: true,
        }
      );

      const newAudio = await Audio.create({
        name: req.body.name,
        genres: req.body.genres.split(', '),
        author: req.user._id,
        duration: req.body.duration,
        fileUrl: audioUploadResponse.secure_url,
        coverUrl: coverUploadResponse.secure_url,
      });
      req.user.createdAudios.push(newAudio._id);
      await req.user.save();
      await newAudio.populate('author');

      res.json(newAudio);
    } catch (error) {
      console.log(error);
    }
  }
);

router.get('/', audioController.getAll);
router.get('/search', audioController.search);
router.patch('/:audioId/like', auth, audioController.favorite);
router.get('/top', audioController.getAllTop);
router.get('/new', audioController.getAllNew);
router.delete('/:id', audioController.delete);
router.get('/:id', historyAuth, audioController.getById);
module.exports = router;
