const { Schema, model } = require('mongoose');

const commentSchema = new Schema ({
    text: {
        type: String,
        required: true,
    },
    audio: {
        type: Schema.Types.ObjectId,
        ref: 'audio',
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'comment',
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('comment', commentSchema);