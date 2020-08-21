const Move = require("../schemas/MoveSchema");
const Category = require("../schemas/CategorySchema");

/**
 * 
 * @param {*} user 
 * @param {*} id 
 */
function findById(user, id) {
    return Move.findOne({ _id: id, user: user });
}

/**
 * 
 * @param {*} user 
 * @param {*} initDate 
 * @param {*} endDate 
 */
function findBetweenDates(user, initDate, endDate) {
    return Move.find({date: { $gt: initDate, $lt: endDate }, user: user})
               .sort({date: "desc"})
               .populate("category").exec();
}

/**
 * 
 * @param {*} user 
 * @param {*} initDate 
 * @param {*} endDate 
 */
async function findBetweenDatesGroupedByDate(user, initDate, endDate) {
    let movesByDate = await Move.aggregate()
    .match({ user: user._id, date: { $gt: initDate, $lt: endDate } })
    .group({
         _id: { date: "$date" },
         moves: { $push: { _id: "$_id", type: "$type", amount: "$amount", category: "$category", description: "$description" }
        },
    })
    .lookup({ from: Category.collection.name, localField: "moves.category", foreignField: "_id", as: "categories" })
    .sort({ "_id.date": "desc" }).exec();

    // TODO populate categories on aggregation
    movesByDate.forEach((moveByDate) => {
        moveByDate.moves.forEach((move) => {
            moveByDate.categories.forEach((category) => {
                if (category._id.equals(move.category)){
                    move.category = category;
                }
            });
        });
    });

    return movesByDate;
}

/**
 * 
 * @param {*} user 
 * @param {*} initDate 
 * @param {*} endDate 
 */
function findAmountSumBetweenDatesGroupedByType(user, initDate, endDate) {
    return Move.aggregate()
               .match({ user: user._id, date: { $gt: initDate, $lt: endDate } })
               .group({ _id: {type: "$type"}, total: {$sum: "$amount"} }).exec();
}

/**
 * 
 * @param {*} user 
 * @param {*} type 
 * @param {*} initDate 
 * @param {*} endDate 
 */
function findAmountSumBetweenDatesAndTypeGroupedByCategory(user, type, initDate, endDate) {
    return Move.aggregate()
               .match({ user: user._id, type: type, date: { $gt: initDate, $lt: endDate } })
               .group({ _id: {category: "$category"}, total: {$sum: "$amount"} })
               .lookup({ from: Category.collection.name, localField: "_id.category", foreignField: "_id", as: "category" }).exec();
}

/**
 * 
 * @param {*} user 
 * @param {*} type 
 */
function findAmountSumByTypeGroupedByMonth(user, type) {
    return Move.aggregate()
               .match({ user: user._id, type: type })
               .group({ _id: { month: {$month: "$date"} }, total: {$sum: "$amount"} }).exec();
}

/**
 * 
 * @param {*} user 
 */
function getLastMoves(user) {
    //TODO limit does not work
    Move.aggregate()
    .match({ user: user._id })
    .group({
         _id: { date: "$date" },
         moves: { $push: { _id: "$_id", type: "$type", amount: "$amount", category: "$category" }
        },
    })
    .lookup({ from: Category.collection.name, localField: "moves.category", foreignField: "_id", as: "categories" })
    .sort({ "_id.date": "desc" })
    .limit(10) // Not working
    .then((movesByDate) => {
        movesByDate.forEach((moveByDate) => {
            moveByDate.moves.forEach((move) => {
                moveByDate.categories.forEach((category) => {
                    if (category._id.equals(move.category)){
                        move.category = category;
                    }
                });
            });
        });
        res.render('movesTableNew', {movesByDate: movesByDate, moment: moment});
    });
}

/**
 * 
 * @param {*} move 
 */
async function save(move) {
    // TODO improve populate
    let newMove = await move.save();
    return newMove.populate("category").execPopulate();
}

/**
 * 
 * @param {*} move 
 */
async function update(move) {
    // TODO improve populate
    let newMove = await Move.findByIdAndUpdate(move._id, move, {new: true}).exec();
    return newMove.populate("category").execPopulate();
}

/**
 * 
 * @param {*} id 
 */
function deleteById(id) {
    return Move.deleteOne({_id: id}).exec();
}

module.exports = 
    { 
        save, 
        update, 
        deleteById, 
        findById, 
        findBetweenDates, 
        findBetweenDatesGroupedByDate, 
        findAmountSumBetweenDatesGroupedByType, 
        findAmountSumBetweenDatesAndTypeGroupedByCategory,
        findAmountSumByTypeGroupedByMonth
    };