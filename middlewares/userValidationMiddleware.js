const validation = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body);
        return next()
    } catch (error) {
        console.log(req.url)
        if (req.url === `/profile/edit-password/${req.params.id}`) return res.status(400).redirect(`/profile/edit-profile/${req.params.id}?error=${encodeURIComponent(error.message)}`);
        if (req.url === `/profile/edit-trainer-password/${req.params.id}`) return res.status(400).redirect(`/profile/edit-trainer-profile/${req.params.id}?error=${encodeURIComponent(error.message)}`);
        return res.status(400).redirect(`${req.url}?error=${encodeURIComponent(error.message)}`);
    }
}

module.exports = validation;