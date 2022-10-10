const jwt = require('jsonwebtoken');

const defaultOptions = {
  expiresIn: '7d',
};

const secretKey = process.env.JWT_SECRET;

exports.generateJwt = (payload) => jwt.sign(payload, secretKey, defaultOptions);

exports.verifyJwt = (token) => jwt.verify(token, secretKey);