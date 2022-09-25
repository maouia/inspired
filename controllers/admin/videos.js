const jwt = require("jsonwebtoken");
const videoModel = require('../../models/admin/video.model');
const multer = require("multer");


module.exports.trainingDetails =async (req,res)=>{
const video = new videoModel('','','','');
video.getAll(req,res);
}


const storage=multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/videoURLs');
    },
    filename: function (req, file, cb) {
        cb(null , Date.now()+'.mp4');
    }
})

const upload=multer({storage:storage,fileFilter: (req, file, cb) => {
        if (file.mimetype == "video/mp4") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .mp4 format allowed!'));
        }
    }}).single('video');
module.exports.storeUpload = async (req,res)=>{
    await upload(req, res, (error) => {
        if (!error) {
            if (req.file) {
                const video = new videoModel('', '', '', '');
                 video.updateVideo(req, res)

            } else {
                req.flash('error', 'You have not upload');
                res.redirect('/admin/k04SuperInspireAccountsk04/training/details/'+req.params.id)
            }
        } else {
            console.log(error)
            req.flash('error', error.message);
            res.redirect('/admin/k04SuperInspireAccountsk04/training/details/'+req.params.id)
        }
    })
};

module.exports.delete =(req,res)=>{
    const video = new videoModel('', '', '', '');
    video.delete(req,res);
}



