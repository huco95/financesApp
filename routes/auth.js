// Express
const express = require("express");
const router = express.Router();
// Passport.js
const passport = require('passport');
const auth = require("../services/auth/utils");

//-------------------- Login --------------------
router.get('/login', (req, res) => {
    res.render('login', { error: req.flash('error')[0] });
});

router.post('/login', passport.authenticate('login_local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

//-------------------- Login JWT --------------------
router.post('/login/jwt', passport.authenticate('login_local', { session: false }), (req, res) => {
    const token = auth.generateToken(req.user);
    res.json(token);
});

router.get('/login/jwt/validate', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json('');
});

//-------------------- Logout --------------------
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//-------------------- Signup --------------------
router.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash('message') });
});

router.post('/signup', passport.authenticate('signup_local', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

module.exports = router;