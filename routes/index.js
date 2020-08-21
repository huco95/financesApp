// Express
const express = require("express");
const router = express.Router();
// Passportjs
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

//-------------------- Home --------------------
router.get('/', auth.isAuthenticated, (req, res) => {
    res.render('home');
});

//-------------------- API --------------------
router.use(require("./categories"));
router.use(require("./moves"));
router.use(require("./stats"));

module.exports = router;