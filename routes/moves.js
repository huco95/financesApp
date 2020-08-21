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

router.get('/getMovesDate', auth.isAuthenticated, async (req, res) => {
    let initDate = new Date(parseInt(req.query.initDate));
    let endDate = new Date(parseInt(req.query.endDate));
    let user = req.user;

    try {
        const movesByDate = await MoveService.findBetweenDatesGroupedByDate(user, initDate, endDate);
        res.render('moves/moves', {movesByDate: movesByDate, format: format, locale: es});
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.get('/getMove', auth.isAuthenticated, async (req, res) => {
    let user = req.user;
    let id = req.query.id;
    
    try {
        const move = await MoveService.findById(user, id);
        res.json(move);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.post('/addMove', auth.isAuthenticated, upload.none(), async (req, res) => {
    let move = new Move();
    move.amount = req.body.amount;
    move.type = req.body.type;
    move.category = req.body.category;
    move.description = req.body.description;
    move.date = req.body.date;
    move.user = req.user;

    try {
        move = await MoveService.save(move);
        res.render('moves/move', {move: move, isNew: true}, (error, html) => {
            if (error) {
                console.error(error);
                res.sendStatus(500);
            } else {
                res.json({ move: move, moveHtml: html });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.post('/updateMove', auth.isAuthenticated, upload.none(), async (req, res) => {
    let move = new Move();
    move._id = req.body.moveId;
    move.amount = req.body.amount;
    move.type = req.body.type;
    move.category = req.body.category;
    move.description = req.body.description;
    move.date = req.body.date;
    move.user = req.user;

    try {
        move = await MoveService.update(move);
        res.render('moves/move', {move: move, isNew: true}, (err, html) => {
            if (err) {
                console.error(error);
                res.sendStatus(500);
            } else {
                res.json({ move: move, moveHtml: html });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});
  
router.post('/deleteMove', auth.isAuthenticated, (req, res) => {
    let id = req.query.id;

    try {
        MoveService.deleteById(id);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;