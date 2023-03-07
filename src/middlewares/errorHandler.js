/**
 * @param {Error} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports = (error, req, res, next) => {
  const codes = [200, 201];
  const statusCode = codes.includes(res.statusCode) ? 500 : res.statusCode;
  const env = process.env.NODE_ENV;

  console.log(error);

  res.status(statusCode).json({
    message: error.message,
    status: statusCode,
    stack: env === 'development' ? error.stack : 'Secret',
  });
};
