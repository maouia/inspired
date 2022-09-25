const adminModule = require('../../models/admin/admin.model');


module.exports.store = (req,res,next)=>{
    var admin = new adminModule('',req.body.email,'');
    admin.login(req,res,req.body.password);
}


module.exports.login = async (req,res,next)=>{
    return await res.render('admin/auth/login',{message:req.flash().error});
}