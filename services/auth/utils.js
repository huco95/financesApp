// Check if user is authenticated, call next() if authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

module.exports = { isAuthenticated };