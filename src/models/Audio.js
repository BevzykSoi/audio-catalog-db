const { Schema, model } = require('mongoose');

const Audio = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    coverUrl: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    usersLiked: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    listenCount: {
      type: Number,
      default: 0,
    },
    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'playlist',
      },
    ],
    genres: [
      {
        type: String,
        enum: [
          'Pop',
          'Rock',
          'Jazz',
          'Traditional',
          'Hip-Hop',
          'Electronic',
          'Folk',
          'Indi',
          'Country',
          'Classical',
        ],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('audio', Audio);
