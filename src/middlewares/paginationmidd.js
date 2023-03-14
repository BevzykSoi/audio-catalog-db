const paginationMiddleware = (req, res, next) => {
  req.query.page = parseInt(req.query.page) || 1;
  req.query.limit = parseInt(req.query.limit) || 10;
  next();
};

module.exports = paginationMiddleware;
