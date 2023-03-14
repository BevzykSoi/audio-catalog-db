const { Audio, Profile, User } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    let { q="", page, perPage } = req.query;

    const searchFilter = {
      name: {
        $regex: q,
        $options: 'i',
      },
    };

    if (!page) {
      page = 1;
    } else {
      page = +page;
    }
    if (!perPage) {
      perPage = 12;
    } else {
      perPage = +perPage;
    }

    const allAudios = await Audio.find(searchFilter, null, {
      limit: perPage,
      skip: (page - 1) * perPage,
    }).populate('author');

    const audiosCount = await Audio.count(searchFilter);

    res.json({
      items: allAudios,
      itemsCount: audiosCount,
      page,
      perPage,
      pagesCount: Math.ceil(audiosCount / perPage),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTop = async (req, res, next) => {
  try {
    let { page, perPage } = req.query;

    if (!page) {
      page = 1;
    } else {
      page = +page;
    }

    if (!perPage) {
      perPage = 12;
    } else {
      perPage = +perPage;
    }
    const allAudiosTOP = await Audio.find(null, null, {
      limit: perPage,
      skip: (page - 1) * perPage,
    })
      .sort({ listenCount: -1 })
      .populate('author');
    const audiosCount = await Audio.count();
    res.json({
      items: allAudiosTOP,
      itemsCount: audiosCount,
      page,
      perPage,
      pagesCount: Math.ceil(audiosCount / perPage),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllNew = async (req, res, next) => {
  try {
    let { page, perPage } = req.query;

    if (!page) {
      page = 1;
    } else {
      page = +page;
    }
    if (!perPage) {
      perPage = 12;
    } else {
      perPage = +perPage;
    }

    const allAudiosNEW = await Audio.find(null, null, {
      limit: perPage,
      skip: (page - 1) * perPage,
    })
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate('author');
    const audiosCount = await Audio.count();
    res.json({
      items: allAudiosNEW,
      itemsCount: audiosCount,
      page,
      perPage,
      pagesCount: Math.ceil(actorsCount / perPage),
    });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    let { q="", page, perPage } = req.query;
    const searchFilter = {
      name: {
        $regex: q,
        $options: 'i',
      },
    };
    if (!page) {
      page = 1;
    } else {
      page = +page;
    }

    if (!perPage) {
      perPage = 12;
    } else {
      perPage = +perPage;
    }

    const audios = await Audio.find(searchFilter, null, {
      limit: perPage,
      skip: (page - 1) * perPage,
    }).populate('author');

    const audiosCount = await Audio.count(searchFilter);

    res.json({
      items: audios,
      itemsCount: audiosCount,
      page,
      perPage,
      pagesCount: Math.ceil(audiosCount / perPage),
    });
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
    res.status(500).json({ message: 'Something went wrong, Not found' });
    console.log(error);
  }
};
