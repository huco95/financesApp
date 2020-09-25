const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');

// Check if user is authenticated, call next() if authenticated
const isAuthenticated = (req, res, next) => {
    if (req.headers.authorization) {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if ((!err || !info) && user) {
                req.user = user;
                return next();
            }
        })(req, res, next);

    } else {
        if (req.isAuthenticated()) {
             return next(); 
        }
        res.redirect('/login');
    }
}

const generateToken = (user) => {
    const payload = { username: user.username };
    const options = { subject: user.id, expiresIn: 3600 };
    return jwt.sign(payload, config.secret, options);
}

module.exports = { isAuthenticated, generateToken };