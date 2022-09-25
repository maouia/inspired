const db = require('../../database/config');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();
class admin {
    constructor (name,email,phone,password) {
        this.valid = false;
        this._name = name;
        this._email = email;
        this.phone=phone;
        this.picture='avatar.png'
        this._password = password;
    }

     register(req,res) {
        bcrypt.hash(req.body.password, 14).then(function(hash) {
            var sql = `INSERT INTO admin (name, email, phone, password, valid, picture,code)VALUES ("${req.body.name}", "${req.body.email}", "${req.body.phone}", "${hash}", "${false}","${'/images/admin/avatar.png'}",'')`;
            db.query(sql, async function (err, result) {
                if (err) {
                    console.log(err)
                    if (err.sqlState === '23000')
                        req.flash('error', 'email or phone already exist');
                    res.redirect('/admin/k04SuperInspireAccountsk04/signup');
                } else {
                    db.query(`SELECT id, name, email, phone, picture FROM admin WHERE id = ${result.insertId}`, async function (err, result, fields) {
                        if (err) {
                            console.log(err)
                            req.flash('error', 'cant open your account');
                            res.redirect('/admin/k04SuperInspireAccountsk04/signup');
                        } else {
                            var user = {
                                id: result[0].id,
                                name: result[0].name,
                                email: result[0].email,
                                phone: result[0].phone,
                                picture: result[0].picture,
                                valid: result[0].valid
                            }
                            const token = await jwt.sign(user, process.env.TOKEN);
                            res.cookie('user', token, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
                            return await res.redirect('/admin/k04SuperInspireAccountsk04');
                        }
                    });
                }
            });
        });
    }


    async login (req,res,password){
        await db.query(`SELECT password,email FROM admin WHERE email='${this._email}' `, async function (err, result, fields) {
            if (!result.length>0) {
                 req.flash('error','Account not exist');
                 return  res.redirect('/admin/k04SuperInspireAccountsk04/login');
            }
            else {
                console.log(result[0].password)
                const match = await bcrypt.compare(password, result[0].password);
                if(match){
                    await db.query(`SELECT id,name,email,phone,valid,picture FROM admin WHERE email='${result[0].email}'`, async function (err2, result2, fields) {
                        if (err2) {
                            await req.flash('error', 'cant open your account');
                            await res.redirect('/admin/k04SuperInspireAccountsk04/login');
                        } else {
                            if (!result2.length > 0) {
                                console.log(result2)
                                await req.flash('error', 'Incorrect password');
                                await res.redirect('/admin/k04SuperInspireAccountsk04/login');
                            } else {
                                var user = {
                                    id: result2[0].id,
                                    name: result2[0].name,
                                    email: result2[0].email,
                                    phone: result2[0].phone,
                                    picture: result2[0].picture,
                                    valid: result2[0].valid
                                }
                                const token = await jwt.sign(user, process.env.TOKEN);
                                res.cookie('user', token, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
                                return await res.redirect('/admin/k04SuperInspireAccountsk04');
                            }
                        }
                    });
                }else {
                    await req.flash('error', 'Incorrect password');
                    await res.redirect('/admin/k04SuperInspireAccountsk04/login');
                }
            }
        });
    }

   async update(req,res,user){
       await db.query(`UPDATE admin SET phone = '${this.phone}' , email='${this._email}' , name='${this._name}', picture='${user.picture}' , valid='${this.valid}' WHERE admin.id = ${user.id}`, async function (err2, result, fields) {
           if (err2) {
               await req.flash('error','Cant Update Your Profile');
               await res.redirect('/admin/k04SuperInspireAccountsk04/profile');
           } else {
                   const token = await jwt.sign(user, process.env.TOKEN);
                   res.cookie('user', token, {maxAge:1000*60*60*24,httpOnly:true});
                   await req.flash('success','Your Account has been Updated');
                   return await res.redirect('/admin/k04SuperInspireAccountsk04/profile');
           }
       });
    }

    insertCode(req,res,id,number){
         db.query(`UPDATE admin SET code = '${number}'  WHERE admin.id = ${id}`, async function (err2, result, fields) {
            if (err2) {
                await req.flash('error','Cant Insert Token');
                await res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
            } else {
                await req.flash('success','Email Send successfully');
                return await res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
            }
        });
    }

    validCode(req,res,id,code){
        db.query(`SELECT code FROM admin WHERE admin.id = ${id}`, async function (err2, result, fields) {
            if (err2) {
                await req.flash('error','Cant Get Data');
                await res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
            } else {
                if(result[0].code===code){
                    db.query(`UPDATE admin SET valid = 'true' , code=''  WHERE admin.id = ${id}`, async function (err2, result, fields) {
                        if (err2) {
                            await req.flash('error','Cant Insert Token');
                            await res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
                        } else {
                            //await req.flash('success','Email Send successfully');
                            return await res.redirect('/admin/k04SuperInspireAccountsk04');
                        }
                    });
                }
                else {
                    await req.flash('error','Invalid Code');
                    await res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
                }
                //await req.flash('success','Email Send successfully');
                //return await res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
            }
        });
    }

}

module.exports = admin;

module.exports.updatePassword =(req,res)=>{
    if(req.body.newPass !== req.body.newPass2){
        req.flash('error','Verif your new Password')
        res.redirect('/admin/k04SuperInspireAccountsk04/profile/changePassword');
    }else{
        db.query(`SELECT password FROM admin WHERE id=${req.params.id}`,async function(err,result){
            const match = await bcrypt.compare(req.body.cPass, result[0].password);
            if(match){
                bcrypt.hash(req.body.newPass, 14).then(function(hash) {
                    db.query(`UPDATE admin SET password ='${hash}' , valid='false' WHERE admin.id = ${req.params.id}`, function (err2, result, fields) {
                        if (err2) {
                            req.flash('error','Cant Save New Password')
                            res.redirect('/admin/k04SuperInspireAccountsk04/profile/changePassword');
                        } else {
                            req.flash('success','Password Updated')
                            res.redirect('/admin/k04SuperInspireAccountsk04/profile/changePassword');
                        }
                    });
                });
            }else{
                req.flash('error','Unvalid Current Password')
                res.redirect('/admin/k04SuperInspireAccountsk04/profile/changePassword');
            }
        });
    }
}