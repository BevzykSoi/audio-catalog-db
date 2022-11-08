const express = require('express');
const path = require('path');
const router = express.Router();
const Audio = require('../models/Audio');
const multer = require('multer');
const fs = require('fs').promises;
const Jimp = require('jimp');
const { number } = require('yup');
const { string } = require('yup/lib/locale');
const auth = require('../middlewares/auth');
const audiosPath = path.join(process.cwd(), 'public/audios');
const audioController = require('../controllers/audioController');

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
      console.log(req.file);

      const audioPath = req.files.audio[0].path;
      const coverPath = req.files.cover[0].path;

      const audioUploadResponse = await cloudinary.uploader.upload(audioPath, {
        resource_type: 'video',
      });
      const coverUploadResponse = await cloudinary.uploader.upload(coverPath);
      console.log(req.files.audio[0].path);
      await fs.unlink(audioPath);
      await fs.unlink(coverPath);

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

router.patch('/:id/favorite', audioController.favorite); //
router.get('/top', audioController.getAllTop); //
router.get('/new', audioController.getAllNew); //
router.delete('/:id', audioController.delete); //
router.get('/:id', audioController.getById); //
module.exports = router;