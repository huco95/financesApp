const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../../schemas/UserSchema");
const config = require('../../config/auth.config');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
};

module.exports = (app) => {
    passport.use('jwt', new JwtStrategy(options, (jwtPayload, done) => {
        User.findOne({ _id: jwtPayload.sub }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
}