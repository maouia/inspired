const db = require('../../database/config');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.getAll=(req,res)=>{

    db.query(`SELECT * FROM formateur`, function (err, result) {
        if (err) {
            const flash =  req.flash();
            const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
            res.render('admin/main/listTeacher', {user: user,teachers:[],nbUser:0,message:flash});
        }
        else {
            db.query(`SELECT COUNT(id_formateur) FROM formateur;`,function (err,result2){
                const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                const flash= req.flash();
                res.render('admin/main/listTeacher',{user:user,teachers:result,nbUser:parseInt(result2[0]['COUNT(id_formateur)']),message:flash});
            })
        }
    });
}


module.exports.addTeacher = (req,res,pass)=>{
    bcrypt.hash(pass, 14).then(function(hash) {
        db.query(`INSERT INTO formateur( firstName,lastName,trainerName, email, gender , password, phone, cin, birthday, avatar,role) 
        VALUES ('${req.body.fname}','${req.body.lname}','${req.body.lname} ${req.body.fname}','${req.body.email}','${req.body.sex}','${hash}','${req.body.phone}','${req.body.cin}','${req.body.birthday}','avatar-1663774797604.jpg','trainer')`,function (err,result){
            if(err){
                console.log(err)
                req.flash('error','Cant Add Teacher');
                res.redirect('/admin/k04SuperInspireAccountsk04/add/teacher');
            }else {
                req.flash('success','Teacher Added Seccessfully');
                res.redirect('/admin/k04SuperInspireAccountsk04/add/teacher');
            }
        })
    })
}

module.exports.updatePassword = (req,res,pass)=>{
    bcrypt.hash(pass, 14).then(function(hash) {
        db.query(`UPDATE formateur SET password='${hash}'WHERE id_formateur=${req.params.id} AND email='${req.params.email}'`,function (err,result){
            if(err){
                req.flash('error','Cant Generate password');
                res.redirect('/admin/k04SuperInspireAccountsk04/teacher/list');
            }else {
                req.flash('success',`New Password Set for ${req.params.name}`);
                res.redirect('/admin/k04SuperInspireAccountsk04/teacher/list');
            }
        })
    })
}

module.exports.deleteTeacher =(req,res)=>{
    db.query(`DELETE FROM formateur WHERE id_formateur = ${req.params.id}`,function (err,result){
        if(err){
            req.flash('error','Cant Delete Teacher');
            res.redirect('/admin/k04SuperInspireAccountsk04/teacher/list');
        }else {
            req.flash('success',`Teacher Deleted`);
            res.redirect('/admin/k04SuperInspireAccountsk04/teacher/list');
        }
    })
}