// Express
const express = require("express");
const router = express.Router();
// Passportjs
const auth = require("../services/auth/utils");

//-------------------- Home --------------------
router.get('/', auth.isAuthenticated, (req, res) => {
    res.render('home');
});

//-------------------- API --------------------
router.use(require("./auth"));
router.use(require("./categories"));
router.use(require("./categories.v2"));
router.use(require("./moves"));
router.use(require("./moves.v2"));
router.use(require("./stats"));
router.use(require("./stats.v2"));

module.exports = router;