const db = require('../../database/config');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();

module.exports.getAll=(req,res)=>{
    const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
    db.query(`SELECT * FROM admin WHERE id <> ${user.id}`,function(err,result){
        if(err){
            const flash =  req.flash();
            const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
            res.render('admin/main/admin-list', {user: user,admins:[],nbUser:0,message:flash});
        }else{
            db.query(`SELECT COUNT(id) FROM admin;`,function (err,result2){
                const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                const flash= req.flash();
                res.render('admin/main/admin-list',{user:user,admins:result,nbUser:parseInt(result2[0]['COUNT(id)'])-1,message:flash});
            })
        }
    });
}


module.exports.addAdmin=(req,res,pass)=>{
    bcrypt.hash(pass, 14).then(function(hash) {
        db.query(`INSERT INTO admin( name, email, password, valid, phone, picture, code) VALUES ('${req.body.name}','${req.body.email}','${hash}','false','${req.body.phone}','avatar.png','')`,function(err,result){
            if(err){
                console.log(err);
                req.flash('error','Cant Add Admin');
                res.redirect('/admin/k04SuperInspireAccountsk04/add/admin');
            }else{
                req.flash('success','Admin Added Seccessfully');
                res.redirect('/admin/k04SuperInspireAccountsk04/add/admin');
            }
        })
    })
}

module.exports.deleteAction=(req,res)=>{
    db.query(`DELETE FROM admin WHERE id = ${req.params.id}`,function(err,result){
        if(err){
            req.flash('error','Cant Delete Admin');
            res.redirect('/admin/k04SuperInspireAccountsk04/admin/list');
        }else{
            req.flash('success','Admin Deleted Seccessfully');
            res.redirect('/admin/k04SuperInspireAccountsk04/admin/list');
        }
    })
}

module.exports.updatePassword = (req,res,pass)=>{
    bcrypt.hash(pass, 14).then(function(hash) {
        db.query(`UPDATE admin SET password='${hash}' WHERE id=${req.params.id}`,function(err,result){
            if(err){
                req.flash('error','Cant Save New Password');
                res.redirect('/admin/k04SuperInspireAccountsk04/admin/list');
            }else{
                req.flash('success',`Password Updated to ${req.params.name}` );
                res.redirect('/admin/k04SuperInspireAccountsk04/admin/list');
            }
        });
    })
}