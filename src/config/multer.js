const multer = require("multer");
const path = require("path");
const avatarsPath = path.join(process.cwd(), 'public/avatars');
const audiosPath = path.join(process.cwd(), 'public/audios'); 
const bannersPath = path.join(process.cwd(), 'public/banners'); 

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsPath);
  },
  filename: (req, file, cb) => {
    const newFileName = `${new Date().getTime()}_${file.originalname}_Avatar`;
    cb(null, newFileName);
  },
});

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audiosPath);
  },
  filename: (req, file, cb) => {
    const newFileName = `${new Date().getTime()}_${file.originalname}_Audio`;
    cb(null, newFileName);
  },
});

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannersPath);
  },
  filename: (req, file, cb) => {
    const newFileName = `${new Date().getTime()}_${file.originalname}_Banner`;
    cb(null, newFileName);
  },
});

exports.avatarUpload = multer({
  avatarStorage,
});

exports.audiosUpload = multer({
  audioStorage,
});

exports.bannerUpload = multer({
  bannerStorage,
});