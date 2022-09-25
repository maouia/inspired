const registerValidation = (schema)=> async (req,res,next)=>{
    try {
        await schema.validate(req.body);
        return next()
    }catch (e){
        req.flash('error',e.errors[0]);
        res.redirect('/admin/k04SuperInspireAccountsk04/signup');
    }
}
module.exports = registerValidation;