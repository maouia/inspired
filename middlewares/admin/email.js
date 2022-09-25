const db = require('../../database/config');
const jwt = require("jsonwebtoken");

module.exports.emailValidation = async (req,res,next)=>{
    const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
    db.query(`SELECT valid FROM admin WHERE email = '${user.email}'`,async function (err, result) {
        if (err) {
            console.log(err)
            req.flash('error','cant found your account');
            res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
        }
        else {
            if(result[0])
            {
                if(result[0].valid==='false'){
                res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
                }
                else next()
            }else{
                res.clearCookie('user');
                res.redirect('/admin/k04SuperInspireAccountsk04/login');
            }
            //req.flash('success','Formation Added With Success');
            //res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
        }
    });
}

module.exports.emailIsValidate = async (req,res,next)=>{
    const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
    db.query(`SELECT valid FROM admin WHERE email = '${user.email}'`,async function (err, result) {
        if (err) {
            req.flash('error','cant found your account');
            res.redirect('/admin/k04SuperInspireAccountsk04/emailverif');
        }
        else {
            if(result[0].valid==='true'){
                res.redirect('/admin/k04SuperInspireAccountsk04');
            }
            else next()
            //req.flash('success','Formation Added With Success');
            //res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
        }
    });
}
