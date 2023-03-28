const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    target: {
      type: String,
      refPath: 'targetModel',
      required: true,
    },
    targetModel: {
      type: String,
      enum: ['user', 'audio', 'comment'],
      required: true,
    },
    type: {
      type: String,
      enum: ['USER_FOLLOW', 'AUDIO_LIKE', 'AUDIO_COMMENT'],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('notification', notificationSchema);
