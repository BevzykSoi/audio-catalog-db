const yup = require('yup');
exports.create = yup.object().shape({
  text: yup.string().max(200).required(),
  audio: yup.string().required(),
  replyTo: yup.string().optional(),
});
