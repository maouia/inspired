const loggedout = (req, res, next) => {
    if (req.cookies['auth-token']) return res.redirect(`/dashboard?error=${encodeURIComponent('log out first then you can go to this page')}`);
    return next();
};

module.exports = loggedout;