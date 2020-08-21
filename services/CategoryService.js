const Category = require("../schemas/CategorySchema");

/**
 * 
 */
function findAll() {
    return Category.find();
}

/**
 * 
 * @param {*} type 
 */
function findByType(type) {
    return Category.find({ type: type }).exec();
}

module.exports = { findAll, findByType };