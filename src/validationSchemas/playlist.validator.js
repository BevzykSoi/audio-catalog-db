const yup = require('yup');
exports.create = yup.object().shape({
  name: yup.string().min(3).required(),
});
