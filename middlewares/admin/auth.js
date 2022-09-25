const jwt = require("jsonwebtoken");
module.exports.userExist=(req,res,next)=>{
    if(req.cookies.user) {
        jwt.verify(req.cookies.user, process.env.TOKEN,function(err, decoded) {
            if(decoded){
                res.redirect('/admin/k04SuperInspireAccountsk04')
            }
            else next()
        });
    }
    else next()
}
module.exports.userNotExist=(req,res,next)=>{

    if(!req.cookies.user) res.redirect('/admin/k04SuperInspireAccountsk04/login')
    else {
        jwt.verify(req.cookies.user, process.env.TOKEN,function(err, decoded) {
            if(err){
                res.clearCookie('user');
                res.redirect('/admin/k04SuperInspireAccountsk04/login')
            }else {
                next()
            }
        });
    }
}