require('dotenv').config();
const jwt = require('jsonwebtoken');

// GET The Home Page
const getHomePage = (req, res) => {
    if (!req.cookies['auth-token']) return res.render('index');
    const decoded = jwt.verify(req.cookies['auth-token'], process.env.ACCESS_TOKEN_SECRET);
    if (decoded.role === 'student') return res.redirect('/dashboard');
    if (decoded.role === 'trainer') return res.redirect('/trainer-dashboard');

};

// Logout
const logout = (req, res) => {
    res.clearCookie('auth-token');
    return res.redirect('/');
}







module.exports = { getHomePage, logout };