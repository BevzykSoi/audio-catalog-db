const express = require('express');
const path = require('path');
const router = express.Router();

const multer = require('multer');

const { auth, historyAuth, schemaValidate } = require('../middlewares');
const audioValidator = require('../validationSchemas/audios.validator');
const audiosPath = path.join(process.cwd(), 'public/audios');
const audioController = require('../controllers/audioController');

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
  schemaValidate(audioValidator.create),
  audioController.create
);

router.get('/', audioController.getAll);
router.get('/search', audioController.search);
router.patch('/:audioId/like', auth, audioController.favorite);
router.patch('/:audioId/playlist/add', auth, audioController.addToPlaylist);
router.patch(
  '/:audioId/playlist/remove',
  auth,
  audioController.removeFromPlaylist
);
router.get('/top', audioController.getAllTop);
router.get('/new', audioController.getAllNew);
router.delete('/:id', audioController.delete);
router.get('/:id', historyAuth, audioController.getById);
router.get('/:id/comments', audioController.getAllComments);
module.exports = router;
