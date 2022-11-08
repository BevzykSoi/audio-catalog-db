const express = require('express');
const path = require('path');
const router = express.Router(); 
const audioController = require('../controllers/audioController');                                                                               
                                                                                                                                                                                                                                                                                                                        
const multer = require('multer');                                                                                 
const fs = require('fs').promises;
const Jimp = require('jimp');
// const { number } = require('yup');
// const { string } = require('yup/lib/locale');
const audiosPath = path.join(process.cwd(), 'public/audios');
 
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
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    const audioPath = path.join(audiosPath, req.files.audio[0].path);
    const coverPath = path.join(audiosPath, req.files.cover[0].path);
 
    const audioUploadResponse = await cloudinary.v2.uploader.upload(audioPath, { resource_type: 'video' });
    const coverUploadResponse = await cloudinary.v2.uploader.upload(coverPath);

    await fs.unlink(audioPath);
    await fs.unlink(coverPath);

    const newAudio = await Audio.create({ 
      name: req.body.name,
      genres: req.body.genres.split(', '),
      author: req.user._id,
      duration: req.body.duration,
      fileUrl: audioUploadResponse.secure_url,
      coverUrl: coverUploadResponse.secure_url}) /
    req.user.createdAudios.push(newAudio._id);
    await req.user.save();
    await newAudio.populate('author');

    res.json(newAudio);
  }
);

router.get('/', audioController.getAll);//
router.get('/:id', audioController.getById);//
router.patch('/:id/favorite', audioController.favorite);//
router.get('/top', audioController.getAllTop);//
router.get('/new', audioController.getAllNew);//
router.delete('/:id', audioController.delete);//

module.exports = router;