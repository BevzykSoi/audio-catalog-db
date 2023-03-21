const { Playlist } = require('../models/index');

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newPlaylist = await Playlist.create({
      name,
      owner: req.user._id,
    });

    req.user.playlists.push(newPlaylist);
    await req.user.save();

    await newPlaylist.populate({
      path: 'owner',
    });

    res.status(201).json(newPlaylist);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const playlists = await Playlist.find()
      .populate('owner')
      .populate('audios');

    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      res.status(400).send('Playlist not found!');
      return;
    }

    await playlist.populate({
      path: 'audios',
    });

    await playlist.populate({
      path: 'owner',
    });

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.params;

    const playlist = await Playlist.findById(id);

    if (playlist.owner._id !== req.user._id) {
      res.status(400).send("You're not the owner of this playlist!");
      return;
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      {
        name,
      },
      {
        new: true,
      }
    );

    if (!updatedPlaylist) {
      res.status(400).send('Playlist not found!');
      return;
    }

    await updatedPlaylist.populate({
      path: 'audios',
    });

    await updatedPlaylist.populate({
      path: 'owner',
    });

    res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id);

    if (playlist.owner._id.valueOf() !== req.user._id.valueOf()) {
      res.status(400).send("You're not the owner of this playlist!");
      return;
    };

    const deletedPlaylist = await Playlist.findByIdAndDelete(id);

    if (!deletedPlaylist) {
      res.status(400).send('Playlist not found!');
      return;
    }

    req.user.playlists.pull(deletedPlaylist);
    await req.user.save();

    await deletedPlaylist.populate({
      path: 'audios',
    });

    await deletedPlaylist.populate({
      path: 'owner',
    });
    

    res.status(200).json({
      message: 'Playlist succesfully deleted!',
      deletedPlaylist,
    });
  } catch (error) {
    next(error);
  }
};
