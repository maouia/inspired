const db = require('../../database/config');
const jwt = require("jsonwebtoken");

class video {
    constructor(id_formation,video,discription,pdf) {
        this.idF =id_formation;
        this.video = '/videos/'+video;
        this.discription=discription;
        this.pdf=pdf;
    }

    getAll(req,res){
        console.log(typeof (req.params.id))
        db.query(`SELECT id_form FROM formation WHERE  id_form=${req.params.id}; `,async function (err, result) {
            if (err) {
                console.log(err)
                req.flash('error','The Training Id Not exist')
                res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
            }
            else{
                if(result[0]){
                    console.log('test 1')
                    db.query(`SELECT * FROM videos WHERE  course_id =${req.params.id}  ORDER BY(creation); `,async function (err, result2) {
                        if (err) {

                            const flash=await req.flash();
                            const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
                            res.render('admin/main/trainDetails',{user:user,video:[],id:req.params.id,message:flash});
                        }
                        else {
                            console.log(result2)
                            const flash=await req.flash();
                            const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
                            res.render('admin/main/trainDetails',{user:user,video:result2,id:req.params.id,message:flash});
                        }
                    });
                }
                else{
                    req.flash('error','The Training Id Not exist')
                    res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
                }
            }

        });
    }



    updateVideo(req,res){
        db.query(`SELECT id_form FROM formation WHERE  id_form =${req.params.id}  `,async function (err, result) {
            if (err) {
                req.flash('error','The Training Id Not exist')
                res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
            }
            else {
                if (result[0]) {
                    const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
                    db.query(`INSERT INTO videos(course_id, creation, video_URL, trainer_id, videoRank) VALUES (${req.params.id},'${new Date().toISOString().split('T')[0]}','${req.file.filename}',${user.id},'0') `, async function (err, result) {
                        if (err) {
                            req.flash('error', 'Cant Update Data');
                            res.redirect('/admin/k04SuperInspireAccountsk04/training/details/' + req.params.id)
                        } else {
                            req.flash('success', 'Data Updated');
                          return   res.redirect('/admin/k04SuperInspireAccountsk04/training/details/' + req.params.id)
                        }
                    });
                }
                else {
                    req.flash('error','The Video Id Not exist')
                    res.redirect('/admin/k04SuperInspireAccountsk04/list/training');
                }
            }
        });
    }

    delete(req,res){
        db.query(`DELETE FROM videos WHERE id_video = ${req.params.id} `,async function (err, result) {
            if (err){
                console.log(err)
                req.flash('error','Cant Delete ');
                res.redirect('/admin/k04SuperInspireAccountsk04/training/details/'+req.params.fid)
            }
            else {
                req.flash('success','Video Deleted');
                res.redirect('/admin/k04SuperInspireAccountsk04/training/details/'+req.params.fid)
            }
        });
    }



}

module.exports = video;