require('dotenv').config();
const db = require('../database/config');
const jwt = require('jsonwebtoken');

const trainerLoggedin = async (req, res, next) => {
    if (!req.cookies['auth-token']) return res.redirect(`/trainer-login?error=${encodeURIComponent('to access to this page you must login First')}`);
    try {
        const decoded = jwt.verify(req.cookies['auth-token'], process.env.ACCESS_TOKEN_SECRET);

        let sql = `SELECT id_formateur, firstName, lastName, trainerName, email, gender, phone, cin, DATE_FORMAT(birthday, "%Y-%m-%d") AS birthday, avatar, role FROM formateur WHERE id_formateur = ${decoded.id}`;

        db.query(sql, (err, result) => {
            if (err) throw err;
            req.user = result[0];
            return next();
        });
    } catch (error) {
        return res.status(400).redirect(`/trainer-login?error=${encodeURIComponent(error)}`);
    }
};

module.exports = trainerLoggedin;