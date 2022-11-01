const express = require('express');
const audioController = require('../controllers/audioController');
const path = require('path');
const router = express.Router();                                                                                
                                                                                                                                                                                                                                                                                                                        
const multer = require('multer');                                                                                 
const fs = require('fs').promises;
const Jimp = require('jimp');
const imagesPath = path.join(process.cwd(), 'public/images');
const uploadsPath = path.join(process.cwd(), 'public/uploads');
const staticFolderPath = path.join(process.cwd(), 'public');

const cloudinary = require('cloudinary').v2
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const newFileName = `${new Date().getTime()}_${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({
  storage,
});
router.post('/', upload.single('image'), async (req, res) => {
console.log(req.file)
  const uploadedImage = await Jimp.read(req.file.path);
  const editedImagePath = path.join(imagesPath, req.file.filename);

  await uploadedImage.resize(256, 256).quality(50).writeAsync(editedImagePath);
  await fs.unlink(req.file.path);

  const uploadResponse = await cloudinary.uploader.upload(editedImagePath);

  res.json(uploadResponse);
});
router.get('/', audioController.getAll);

router.get('/:id', audioController.getById);
router.patch('/:contactId/favorite', audioController.favorite);
router.get('/top', audioController.getAllTop);
router.get('/new', audioController.getAllNew);
// router.put('/:id', audioController.update);
// router.delete('/:id', audioController.delete);

module.exports = router;