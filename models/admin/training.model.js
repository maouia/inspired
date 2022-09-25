const db = require('../../database/config');
const jwt = require("jsonwebtoken");

class training{
    constructor(name,details,picture,categorie,price) {
    this.name=name;
    this.details=details;
    this.createdat=new Date().toISOString().split('T')[0]
    this.picture=picture;
    this.categorie = categorie;
    this.price=price;
    }

    store(req,res,cat){
        const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
        db.query(`INSERT INTO formation(nom_form,thubmnail,nb_videos,duree,date_creation,description,category,id_formateur,prix) VALUES ('${this.name}','${this.picture}','0','0','${this.createdat}','${this.details}','${this.categorie}',${user.id},${this.price});`, async function (err, result) {
            if (err) {
                console.log(err)
                req.flash('error','cant add the formation');
                res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
            }
            else {
               await db.query(`INSERT INTO categories(category_name) VALUES ('${cat}')`, function (err, result) {});
                req.flash('success','Formation Added With Success');
                res.redirect('/admin/k04SuperInspireAccountsk04/add/training');
            }
        });
    }


    getAll(req,res){
        if(req.query.page){
            var start = (parseInt(req.query.page)-1)*6
        }else {
           var start = 0
        }
        db.query(`SELECT * FROM formation LIMIT ${start} , 6`, function (err, result) {
            if (err) {
                const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                const flash= req.flash();
                res.render('admin/main/listTraining',{user:user,training:[],nbp:0,message:flash});
            }
            else {
                db.query(`SELECT COUNT(id_form) FROM formation;`,function (err,result2){
                    const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                    const flash= req.flash();
                    res.render('admin/main/listTraining',{user:user,training:result,nbp:Math.floor(result2[0]['COUNT(id_form)']/6),message:flash});
                })
            }
        });
    }

    delete(req,res,id){
        db.query(`DELETE FROM formation WHERE id_form =${id}; `, function (err, result) {
            if (err) {
                req.flash('error','Cant Delete the formation');
                res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
            }
            else {
                req.flash('success','Formation Deleted With Success');
                res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
            }
        });
    }

    getOne(req,res,id){
            db.query(`SELECT * FROM formation WHERE id_form =${id}; `, function (err, result) {
            if (err) {
                req.flash('error','Cant Get Training Data');
                 res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
            }
            else {
                if(result[0]){
                    db.query(`SELECT * FROM categories `, function (err, result2) {
                        if (err) {
                            req.flash('error','Cant Get Training Data');
                            res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
                        }
                        else {
                            const flash= req.flash();
                            const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                            res.render('admin/main/updateTraining',{user:user,result:result[0],categories:result2,message:flash});
                        }
                    });
                }else {
                    req.flash('error','This Training not Exist');
                     res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
                }
                //req.flash('success','Formation Deleted With Success');
                //await res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
            }
        });
    }
    update(req,res,id){
        let sql ='';
        if(this.picture.length>0)  sql = `UPDATE formation SET nom_form='${this.name}',description='${this.details}',thubmnail='${this.picture}',category='${this.categorie}',prix='${this.price}' WHERE id_form=${id}; `
        else  sql = `UPDATE formation SET nom_form='${this.name}',description='${this.details}',category='${this.categorie}',prix='${this.price}' WHERE id_form=${id}; `
        let s =`INSERT INTO categories(category_name) VALUES ('${this.categorie}')`
        db.query(sql, function (err, result) {
            if (err) {
                console.log(err)
                req.flash('error','Cant Update Training Data');
                res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
            }
            else {
                db.query(s, function (err, result) {});
                    req.flash('success','Training Updated');
                     res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
                }
        });
    }

    addTraining(req,res){
        /*     const flash=await req.flash();
    const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
    res.render('admin/main/addTraining',{user:user,message:flash});  */
        db.query(`SELECT * FROM categories `, function (err, result) {
            if (err) {
                const flash= req.flash();
                const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                res.render('admin/main/addTraining',{user:user,message:flash});
            }
            else {
                const flash= req.flash();
                const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
                res.render('admin/main/addTraining',{user:user,message:flash,categories:result});
            }
        });

    }


}

module.exports = training;