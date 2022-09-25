require('dotenv').config();
const db = require('../../database/config');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: `./public/images/upload`,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1000000
    }
}).single('avatar');

// Edit The Avatar Of The User
const editUserAvatar = (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.redirect(`/profile/edit-profile/${req.params.id}?error=${encodeURIComponent(err)}`);
        
        if (!req.file) return res.redirect(`/profile/edit-profile/${req.params.id}?error=${encodeURIComponent('Choose an avatar ')}`);

        // extract the file extention from the uploaded file
        const fext = path.extname(req.file.originalname);

        if ((fext !== '.jpg' && fext !== '.jpeg' && fext !== '.png') && (fext !== '.JPG' && fext !== '.JPEG' && fext !== '.PNG')) return res.redirect(`/profile?error=${encodeURIComponent('accepted extention : jpg, jpeg, png')}`);

        let sql = `UPDATE user SET avatar = '${req.file.filename}' WHERE id = ${req.params.id}`;

        db.query(sql, (err, row) => {
            if (err) throw err;

            return res.redirect(`/profile/edit-profile/${req.params.id}?success=${encodeURIComponent('avatar changed successfully')}`);
        })

    });
};

const editTrainerAvatar = (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?error=${encodeURIComponent(err)}`);
        
        if (!req.file) return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?error=${encodeURIComponent('Choose an avatar ')}`);
        // extract the file extention from the uploaded file
        const fext = path.extname(req.file.originalname);

        if ((fext !== '.jpg' && fext !== '.jpeg' && fext !== '.png') && (fext !== '.JPG' && fext !== '.JPEG' && fext !== '.PNG')) return res.redirect(`/profile?error=${encodeURIComponent('accepted extention : jpg, jpeg, png')}`);

        let sql = `UPDATE formateur SET avatar = '${req.file.filename}' WHERE id_formateur = ${req.params.id}`;

        db.query(sql, (err, row) => {
            if (err) throw err;

            return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?success=${encodeURIComponent('avatar changed successfully')}`);
        })

    });
}


module.exports = {editUserAvatar, editTrainerAvatar};