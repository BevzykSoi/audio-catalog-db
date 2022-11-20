const passport = require('passport');

module.exports = (req, res, next) => {
  passport.authenticate(
    'jwt',
    {
      session: false,
    },
    (error, user) => {
      if (!user) {
        next();
        return;
      }

      if (error) {
        res.status(400).send(`Error: ${error}`);
        return;
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
