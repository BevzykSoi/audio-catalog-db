const { ExtractJwt, Strategy } = require('passport-jwt');
const { User } = require('../../models');

module.exports = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
  },
  async (req, payload, done) => {
    try {
      const user = await User.findById(payload._id);

      if (!user) {
        done(null, false);
        return;
      }

      const token = req.headers.authorization.slice(7);
      if (!user || !token) {
        done(null, false);
        return;
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);