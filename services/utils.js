function round(value) {
    return Number(Math.round(value + 'e' + 2)+'e-' + 2);
}

module.exports = { round };