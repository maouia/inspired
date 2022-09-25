require('dotenv').config();
const db = require('../../database/config');
const path = require('path');
const moment = require('moment');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: `./public/images/videoURLs`,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
}).single('video_URL');

const addVideo = (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent(err)}`);

        if (!req.file) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent('Choose The Vide URL  ')}`);

        // extract the file extention from the uploaded file
        const fext = path.extname(req.file.originalname);

        if ( fext !== '.mp4' && fext !== '.MP4' ) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent('accepted extention : .mp4 OR .MP4')}`);
        
        if (!req.body.videoRank) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent('please give us the rank of this video ')}`);

        let sql = `SELECT videoRank FROM videos WHERE course_id = ${req.params.id} AND videoRank = ${req.body.videoRank}`;

        db.query(sql, (err, result0) => {
            if (err) throw err;

            if (result0.length !== 0) return res.redirect(`/edit-course/${req.params.id}?error=${encodeURIComponent('there is video under that rank')}`);
        
            let sql = `INSERT INTO videos SET ?`;

            db.query(sql, { course_id: req.params.id, trainer_id: req.user.id_formateur, creation: moment().format('YYYY-MM-D'), video_URL: req.file.filename, videoRank: req.body.videoRank }, (err, row) => {
                if (err) throw err;

                let sql = `UPDATE formation SET  nb_videos = nb_videos + 1  WHERE id_form = ${req.params.id}`;

                db.query(sql, (err, rows) => {
                    if (err) throw err;

                    return res.redirect(`/edit-course/${req.params.id}?success=${encodeURIComponent('Video Added To This Course successfully')}`);

                });
            });
        });
    });
}

module.exports = {addVideo};