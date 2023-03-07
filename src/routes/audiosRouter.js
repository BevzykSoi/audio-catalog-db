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
  audioController.create
);
router.get('/', audioController.getAll);
router.patch('/:audioId/like', auth, audioController.favorite);
router.get('/top', audioController.getAllTop);
router.get('/new', audioController.getAllNew);
router.delete('/:id', audioController.delete);
router.get('/:id', audioController.getById);
module.exports = router;
