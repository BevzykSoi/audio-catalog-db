const { Audio } = require('../models');
const { User } = require('../models');
exports.getAll = async (req, res, next) => {
  try {
    const allAudios = await Audio.find().populate('author');
    // await allAudios.populate('author')
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
    //  await allAudiosTOP.populate('author')
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
    //  await allAudiosNEW.populate('author')
    res.json(allAudiosNEW);
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

    const audio1 = await Audio.findByIdAndDelete(id);
    await audio1.populate('author');
    res.json(audio1);
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
    res.status(500).json({ message: 'Something went wrong, Not found' });
    console.log(error);
  }
};
