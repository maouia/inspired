require('dotenv').config();
const db = require('../../database/config');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: `./public/images/thubmnails`,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1000000
    }
}).single('thubmnail');

// Edit Course Thumnail
const editCourseThubmnail = (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent(err)}`);

        if (!req.file) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent('Choose a Thumbnail ')}`);

        // extract the file extention from the uploaded file
        const fext = path.extname(req.file.originalname);

        if ((fext !== '.jpg' && fext !== '.jpeg' && fext !== '.png') && (fext !== '.JPG' && fext !== '.JPEG' && fext !== '.PNG')) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent('accepted extention : jpg, jpeg, png')}`);
        
        let sql = `UPDATE formation SET thubmnail = '${req.file.filename}' WHERE id_form = ${req.params.id}`;

        db.query(sql, (err, row) => {
            if (err) throw err;

            return res.redirect(`/edit-course/${req.params.id}?success=${encodeURIComponent('Thubmnail changed successfully')}`);
        })

    });
}

module.exports = { editCourseThubmnail }