const { Schema, model } = require('mongoose');

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    likedAudios: [
      {
        type: Schema.Types.ObjectId,
        ref: 'audio',
      },
    ],
    createdAudios: [
      {
        type: Schema.Types.ObjectId,
        ref: 'audio',
      },
    ],
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'profile',
    },
    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'playlist',
      },
    ],
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
    history: [
      {
        type: Schema.Types.ObjectId,
        ref: 'audio',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('user', User);
