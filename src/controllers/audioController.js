const { Audio, Profile, User, Comment, Playlist } = require('../models');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

exports.create = async (req, res, next) => {
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
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const allAudios = await Audio.find().populate('author');
    res.json(allAudios);
  } catch (error) {
    next(error);
  }
};

exports.getAllTop = async (req, res, next) => {
  try {
    const allAudiosTOP = await Audio.find()
      .sort({ listenCount: -1 })
      .populate('author');
    res.json(allAudiosTOP);
  } catch (error) {
    next(error);
  }
};

exports.getAllNew = async (req, res, next) => {
  try {
    const allAudiosNEW = await Audio.find()
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate('author');
    res.json(allAudiosNEW);
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;

    const audios = await Audio.find(
      {
        name: {
          $regex: q,
          $options: 'i',
        },
      },
      null,
      {}
    ).populate('author');

    res.json(audios);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const audio = await Audio.findById(id);

    if (!audio) {
      res.status(400).send('Audio did not found!');
    }

    await req.user.populate({
      path: 'profile',
    });

    if (req.user && req.user.profile.saveHistory === true) {
      req.user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            history: audio._id,
          },
        },
        {
          new: true,
        }
      );
    }

    await audio.populate('author');
    res.json(audio);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const audio = await Audio.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await audio.populate('author');
    res.json(audio);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const audio = await Audio.findByIdAndDelete(id);
    await audio.populate('author');

    const user = await User.findByIdAndUpdate(
      audio.author._id,
      {
        $pull: {
          createdAudios: audio._id,
          likedAudios: audio._id,
          history: audio._id,
        },
      },
      {
        new: false,
      }
    ).populate({
      path: 'profile',
    });

    res.json(audio, user);
  } catch (error) {
    next(error);
  }
};

exports.favorite = async (req, res, next) => {
  const { audioId } = req.params;

  try {
    let updatedAudio = await Audio.findById(audioId);

    if (!updatedAudio) {
      return res
        .status(404)
        .json({ message: `Audio with id ${audioId} not found` });
    }
    const audioLiked = updatedAudio.usersLiked.includes(req.user.id);

    if (audioLiked) {
      updatedAudio = await Audio.findByIdAndUpdate(
        audioId,
        {
          $pull: { usersLiked: req.user.id },
        },
        {
          new: true,
        }
      );
      req.user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { likedAudios: updatedAudio.id },
        },
        {
          new: true,
        }
      );
    } else {
      updatedAudio = await Audio.findByIdAndUpdate(
        audioId,
        {
          $addToSet: { usersLiked: req.user.id },
        },
        {
          new: true,
        }
      );
      req.user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $addToSet: { likedAudios: updatedAudio.id },
        },
        {
          new: true,
        }
      );
    }
    await updatedAudio.populate('author');

    res.json(updatedAudio);
  } catch (error) {
    next(error);
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    const audio = await Audio.findById(id);

    if (!audio) {
      res.status(400).send('Audio did not found!');
    }

    const comments = await Comment.find(audio._id).populate('owner');

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

exports.addToPlaylist = async (req, res, next) => {
  try {
    const { audioId } = req.params;
    const { playlistId } = req.body;

    const audio = await Audio.findById(audioId);

    if (!audio) {
      res.status(400).send('Audio not found!');
      return;
    }

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $push: {
          audios: audio._id,
        },
        $addToSet: {
          genres: audio.genres,
        },
      },
      {
        new: true,
      }
    );

    await playlist.populate({
      path: 'audios',
    });

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.removeFromPlaylist = async (req, res, next) => {
  try {
    const { audioId } = req.params;
    const { playlistId } = req.body;

    const audio = await Audio.findById(audioId).populate('genres');

    if (!audio) {
      res.status(400).send('Audio not found!');
      return;
    }

    let playlist = await Playlist.findById(playlistId)
      .populate({
        path: 'audios',
        populate: {
          path: 'genres',
        },
      })
      .populate('genres');

    let deletedGenres = [];

    if (playlist.audios.length >= 2) {
      const otherAudioGenres = playlist.audios
        .filter((a) => a._id.valueOf() !== audioId)
        .flatMap((a) => a.genres);

      deletedGenres = audio.genres.filter(
        (genre) => !otherAudioGenres.some((og) => og === genre)
      );

      playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
          $pull: {
            audios: audio._id,
            genres: {
              $in: deletedGenres,
            },
          },
        },
        {
          new: true,
        }
      );
    } else {
      playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
          $pull: {
            audios: audio._id,
            genres: {
              $in: audio.genres,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};
