// Express
const express = require("express");
const router = express.Router();
// MonogDB
const CategoryService = require("../services/CategoryService");
// Passport.js
const auth = require("../services/auth/utils");

router.get('/categories/:type', auth.isAuthenticated, async (req, res) => {
    let type = req.params.type;

    try {
        const categories = await CategoryService.findByType(type);
        res.json(categories);
        
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;