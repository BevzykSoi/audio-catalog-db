const { Schema, model } = require('mongoose');

const Profile = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    language: {
      type: String,
      enum: ['English', 'Ukrainian'],
      default: 'English',
    },
    theme: {
      type: String,
      enum: ['Light', 'Dark'],
      default: 'Light',
    },
    avatarUrl: {
      type: String,
      required: true,
      default:
        'https://res.cloudinary.com/bevzyksoi/image/upload/v1665503880/defaultAvatar_jifgdp.png',
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
