require('dotenv').config();
const db = require('../database/config');
const jwt = require('jsonwebtoken');

const loggedin = async (req, res, next) => {
    if (!req.cookies['auth-token']) return res.redirect(`/login?error=${encodeURIComponent('to access to this page you must login or signup first')}`);
    try {
        const decoded = jwt.verify(req.cookies['auth-token'], process.env.ACCESS_TOKEN_SECRET);

        let sql = `SELECT id, firstName, lastName, userName, email, gender, phone, cin, DATE_FORMAT(birthday, "%Y-%m-%d") AS birthday, avatar, levelOfStudy, role, solde FROM user WHERE id = ${decoded.id}`;

        db.query(sql, (err, result) => {
            if (err) throw err;
            req.user = result[0];
            return next();
        });
    } catch (error) {
        return res.status(400).redirect(`/login?error=${encodeURIComponent(error)}`);
    }
};

module.exports = loggedin;