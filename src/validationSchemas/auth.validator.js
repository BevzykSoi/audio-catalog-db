const yup = require('yup');
exports.register = yup.object().shape({
  username: yup.string().min(3).required(),
  password: yup.string().min(8).required(),
});
exports.login = yup.object().shape({
  username: yup.string().min(3).required(),
  password: yup.string().min(8).required(),
});
