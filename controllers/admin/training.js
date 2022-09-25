const jwt = require("jsonwebtoken");
const trainingModel = require('../../models/admin/training.model');

module.exports.addTraining =async (req,res)=>{

    const training = new trainingModel('', '', '');
    training.addTraining(req, res, req.params.id);
}

module.exports.listTraining=async (req,res)=>{
    const training = new trainingModel('','');
    training.getAll(req,res);

}


const multer = require('multer');
const storage=multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/thubmnails');
    },
    filename: function (req, file, cb) {
        cb(null , Date.now()+file.originalname);
    }
})
const upload=multer({storage:storage,  fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('picture');
module.exports.store=async (req,res)=>{
    await upload (req, res, (error) => {
        let cat ='';
        if(!error){
            console.log(req.body.categorie)
            if (req.body.name.length > 0 && req.body.details.length > 0 && req.body.categorie!=='0' && req.body.price) {
                if(req.body.categorie==='other'){
                    if(req.body.other_categorie.length>0) {
                         cat = req.body.other_categorie;
                    }
                    else {
                        req.flash('error', 'You didnt chose a Categorie');
                        res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
                    }
                }
                else {
                     cat = req.body.categorie
                }
                if (req.file) {
                    const training = new trainingModel(req.body.name, req.body.details, req.file.filename,cat,req.body.price);
                    training.store(req, res, cat);
                } else {
                    req.flash('error', 'Picture is Required');
                    res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
                }
            } else {
                req.flash('error','All Field Are Required');
                res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
            }
        }else {
            req.flash('error',error.message);
            res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
        }
    })
}

module.exports.delete =  (req,res)=>{
    const training = new trainingModel('','');
    training.delete(req,res,req.params.id);
}

module.exports.update = (req,res)=>{
    const training = new trainingModel('','');
    training.getOne(req,res,req.params.id);
}


const upload2=multer({storage:storage,  fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('picture');
module.exports.updateAction = async (req,res)=>{
    await upload2 (req, res, (error) => {
        if(!error){
            if (req.body.name.length > 0 && req.body.details.length > 0 && req.body.categorie!=='0' && req.body.price) {
                if(req.body.categorie==='other'){
                    if(req.body.other_categorie.length>0) {
                        var cat = req.body.other_categorie;
                    }
                    else {
                        req.flash('error', 'You didnt chose a Categorie');
                        res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
                    }
                }
                else {
                    var cat = req.body.categorie
                }
                if (req.file) {
                    const training = new trainingModel(req.body.name, req.body.details, req.file.filename,cat,req.body.price);
                    training.update(req, res,req.params.id);
                } else {
                    const training = new trainingModel(req.body.name, req.body.details, '',cat,req.body.price);
                    training.update(req, res,req.params.id);
                }
            } else {
                req.flash('error','All Field Are Required');
                res.redirect('/admin/k04SuperInspireAccountsk04/update/training/'+req.params.id);
            }
        }else {
            req.flash('error',error.message);
            res.redirect('/admin/k04SuperInspireAccountsk04/update/training/'+req.params.id);
        }
    })
}