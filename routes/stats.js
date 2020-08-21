// Express
const express = require("express");
const router = express.Router();
// MonogDB
const StatsService = require("../services/StatsService");
const Category = require("../schemas/CategorySchema");
const Move = require("../schemas/MoveSchema");
// Passport.js
const auth = require("../services/auth/utils");

router.get('/incomesExpensesStats', auth.isAuthenticated, async (req, res) => {
    let user = req.user;
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));

    try {
        const balance = await StatsService.getBalance(user, initDate, endDate);
        res.render('stats/totals', balance);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.get('/categoryChartList', auth.isAuthenticated, (req, res) => {
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));

    Promise.all([
        // Get aggregation by category
        Move.aggregate()
        .match({ user: req.user._id, type: "expense", date: { $gt: initDate, $lt: endDate } })
        .group({ _id: {category: "$category"}, total: {$sum: "$amount"} })
        .lookup({ from: Category.collection.name, localField: "_id.category", foreignField: "_id", as: "category" })
        .sort({ "category.name": "asc" }),

        // Get the total expense amount
        Move.aggregate()
        .match({ user: req.user._id, type: "expense", date: { $gt: initDate, $lt: endDate } })
        .group({ _id: {user: "$user"}, total: {$sum: "$amount"} })

    ]).then((result) => {
        if (result.length > 0 && result[0].length > 0) {
            var movesAggregation = result[0];
            var data = [];
            var maxAmount = 0;
            var total = result[1][0].total;

            movesAggregation.forEach((move) => {
                data.push({
                    name: move.category[0].name,
                    amount: move.total,
                    percent: Math.round(move.total / total * 100),
                    color: move.category[0].color,
                    icon: move.category[0].icon
                });

                if (maxAmount < move.total) {
                    maxAmount = move.total;
                }
            });

            data.forEach((catgeoryData) => {
                catgeoryData.realtivePercent = Math.round(catgeoryData.amount * 100 / maxAmount);
            });
        }

        res.render('stats/categoryChartList', {categories: data, total: total, maxAmount: maxAmount});
    });
});

router.get('/categoryChartPie', auth.isAuthenticated, async (req, res) => {
    let user = req.user;
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));

    try {
        const result = await StatsService.getExpensesCategoryChartPie(user, initDate, endDate);
        res.render('stats/chartLegend', {legends: result.legends}, (error, html) => {
            if (error) {
                console.error(error);
                res.sendStatus(500);
            } else {
                res.json({ chart: { type: 'doughnut', data: result.data, options: {} }, lengedsHtml: html });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500);
    }   
});

router.get('/monthsChart', auth.isAuthenticated, async (req, res) => {
    let user = req.user;

    try {
        const result = await StatsService.getMonthlyBalanceChart(user);
        res.render('stats/chartLegend', {legends: result.legends}, (err, html) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json({ chart: { type: 'bar', data: result.data, options: {} }, lengedsHtml: html });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500);
    }   
});

module.exports = router;