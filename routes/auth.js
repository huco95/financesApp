// Express
const express = require("express");
const router = express.Router();
// Passport.js
const passport = require('passport');
const auth = require("../services/auth/utils");
// MonogDB
const UserService = require("../services/UserService");
const User = require("../schemas/UserSchema");

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
router.get('/signup/local', (req, res) => {
    res.render('signup', { message: req.flash('message') });
});

router.post('/signup/local', passport.authenticate('signup_local', {
    successRedirect: '/',
    failureRedirect: '/signup/local',
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

//-------------------- Signup --------------------
router.post('/signup', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        let result = await UserService.createUser(username, password);
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;