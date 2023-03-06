const { Playlist } = require('../models/index');

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newPlaylist = await Playlist.create({
      name,
      owner: req.user._id,
    });

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
    const playlists = await Playlist.find();

    for await (const playlist of playlists) {
      await playlist.populate({
        path: 'owner',
      });

      await playlist.populate({
        path: 'audios',
      });
    }

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

    const playlist = await Playlist.findByIdAndUpdate(
      id,
      {
        name,
      },
      {
        new: true,
      }
    );

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

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findByIdAndDelete(id);

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

    res.status(200).json({
      message: 'Playlist succesfully deleted!',
      playlist,
    });
  } catch (error) {
    next(error);
  }
};
