const yup = require('yup');
exports.create = yup.object().shape({
  name: yup.string().min(3).required(),
  genres: yup.string().required(),
  duration: yup.number().required(),
});
