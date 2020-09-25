// Express
const express = require("express");
const router = express.Router();
// Multer, read FormData
const multer = require('multer');
const upload = multer();
// MonogDB
const MoveService = require("../services/MoveService");
const Move = require("../schemas/MoveSchema");
// Date-fns
var format = require("date-fns/format");
var es = require("date-fns/locale/es");
// Passport.js
const auth = require("../services/auth/utils");

router.get('/moves/dateGrouped', auth.isAuthenticated, async (req, res) => {
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));
    let user = req.user;

    try {
        const movesByDate = await MoveService.findBetweenDatesGroupedByDate(user, initDate, endDate);
        res.json(movesByDate);

    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.post('/move', auth.isAuthenticated, upload.none(), async (req, res) => {
    let move = new Move();
    move._id = req.body._id;
    move.amount = req.body.amount;
    move.type = req.body.type;
    move.category = req.body.category;
    move.description = req.body.description;
    move.date = req.body.date;
    move.user = req.user;

    try {
        if (req.body._id) {
            move = await MoveService.update(move);
        } else {
            move = await MoveService.save(move);
        }
        res.json(move);

    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.get('/move/:id', auth.isAuthenticated, async (req, res) => {
    let user = req.user;
    let id = req.params.id;
    
    try {
        const move = await MoveService.findById(user, id);
        res.json(move);

    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.delete('/move/:id', auth.isAuthenticated, (req, res) => {
    let user = req.user;
    let id = req.params.id;

    try {
        MoveService.deleteById(id, user);
        res.json('');

    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;