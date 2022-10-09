const { Schema, model } = require('mongoose');

const Playlist = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    audios: [
      {
        type: Schema.Types.ObjectId,
        ref: 'audio',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
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

module.exports = model('playlist', Playlist);
