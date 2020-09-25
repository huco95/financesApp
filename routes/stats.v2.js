// Express
const express = require("express");
const router = express.Router();
// MonogDB
const StatsService = require("../services/StatsService");
// Passport.js
const auth = require("../services/auth/utils");

router.get('/stats/totals', auth.isAuthenticated, async (req, res) => {
    let user = req.user;
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));

    try {
        const balance = await StatsService.getBalance(user, initDate, endDate);
        res.json(balance);

    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.get('/stats/chart/annual', auth.isAuthenticated, async (req, res) => {
    let user = req.user;
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));

    try {
        const result = await StatsService.getMonthlyBalanceChart(user, initDate, endDate);
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500);
    }   
});

router.get('/stats/chart/categories', auth.isAuthenticated, async (req, res) => {
    let user = req.user;
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));

    try {
        const result = await StatsService.getExpensesCategoryChartPie(user, initDate, endDate);
        res.json(result);
        
    } catch (error) {
        console.error(error);
        res.status(500);
    }   
});

module.exports = router;