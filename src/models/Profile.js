const { Schema, model } = require('mongoose');

const Profile = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    language: {
      type: String,
      enum: ['en', 'ua'],
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    avatarUrl: {
      type: String,
      required: true,
      default:
        'https://res.cloudinary.com/bevzyksoi/image/upload/v1668016321/sbcf-default-avatar_dykn6i.png',
    },
    banner: String,
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
    saveHistory: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('profile', Profile);
