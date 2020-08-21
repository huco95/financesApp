// Express
const express = require("express");
const router = express.Router();
// MonogDB
const CategoryService = require("../services/CategoryService");
// Passport.js
const auth = require("../services/auth/utils");

router.get('/getCategories', auth.isAuthenticated, async (req, res) => {
    let type = req.query.type;

    try {
        const categories = await CategoryService.findByType(type);
        res.render('moves/categorySelect', {categories: categories});
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;