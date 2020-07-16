const User = require("../models/user");
const { AppDefaults } = require("../config");
const { Strategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: AppDefaults.SECRET,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      await User.findById(payload.user_id)
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((err) => done(null, false));
    })
  );
};
