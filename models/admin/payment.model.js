const db = require('../../database/config');
const jwt = require("jsonwebtoken");

module.exports.getAllPayment = (req,res)=>{
    db.query(`SELECT * FROM payement ORDER BY date desc;`, function (err, result) {
        if (err) {
            const flash =  req.flash();
            const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
            res.render('admin/main/listPayment', {user: user,payments:[],message:flash});
        }
        else {

                const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                const flash= req.flash();
                res.render('admin/main/listPayment',{user:user,payments:result,message:flash});
        }
    });
}

module.exports.agreePayment =(req,res)=>{
    db.query(`UPDATE payement SET etat='accepted' WHERE id_payement=${req.params.id}`, function (err, result) {
        if (err) {
            req.flash('error','Cant Accept');
            res.redirect('/admin/k04SuperInspireAccountsk04/payment/list');
        }
        else {
            db.query(`UPDATE user SET solde=solde+${req.body.somme} WHERE id=${req.params.uid}`, function (err, result) {
                if (err) {
                    console.log(err)
                    req.flash('error','Cant Accept');
                    res.redirect('/admin/k04SuperInspireAccountsk04/payment/list');
                }
                else {
                    req.flash('success','Payment Accepted');
                    res.redirect('/admin/k04SuperInspireAccountsk04/payment/list');
                }
            });

        }
    });
}

module.exports.rejectPayment =(req,res)=>{
    db.query(`UPDATE payement SET etat='rejected' WHERE id_payement=${req.params.id}`, function (err, result) {
        if (err) {
            req.flash('error','Cant Accept');
            res.redirect('/admin/k04SuperInspireAccountsk04/payment/list');
        }
        else {
            req.flash('success','Payment Accepted');
            res.redirect('/admin/k04SuperInspireAccountsk04/payment/list');
        }
    });
}

module.exports.getOnePayment =(req,res)=>{
    db.query(`SELECT * FROM payement where id_payement=${req.params.id};`, function (err, result) {
        if (err) {
            req.flash('error','Cant Get Details');
            res.redirect('/admin/k04SuperInspireAccountsk04/payment/list');
        }
        else {
            if(result[0]) {
                const flash = req.flash();
                const user = jwt.verify(req.cookies.user, process.env.TOKEN);
                res.render('admin/main/payment', {user: user,payment:result[0], message:flash});
            }
            else {
                req.flash('error','Cant Get Details');
                res.redirect('/admin/k04SuperInspireAccountsk04/payment/list');
            }
        }
    });



}