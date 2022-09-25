const adminModule = require('../../models/admin/admin.model');
const {updatePassword} = require('../../models/admin/admin.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');
const storage=multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/admin/');
    },
    filename: function (req, file, cb) {
        cb(null , Date.now()+file.originalname);
    }
})
const upload=multer({storage:storage,limits : {fileSize : 3000000}}).single('picture');

module.exports.index =  (req,res)=>{
    const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
    console.log(user.id)
    res.render('admin/main/index',{user:user});
}

module.exports.logout =(req,res)=>{
        res.clearCookie('user');
        res.redirect('/admin/k04SuperInspireAccountsk04/login');
}

module.exports.profile =  (req,res)=>{
    const flash= req.flash();
    const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
    res.render('admin/main/profile',{user:user,message:flash});
}


module.exports.update = async (req,res)=>{
        await upload (req, res, (error) => {
            const cuser = jwt.verify(req.cookies.user, process.env.TOKEN);
            if(req.body.name.length>0&&req.body.email.length>0&&req.body.phone.length>0){
                if (req.file) {
                    const user = {
                        id: parseInt(cuser.id),
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        picture: req.file.filename,
                        valid: 'false',
                    }
                    var admin = new adminModule(req.body.name, req.body.email, req.body.phone, '');
                    admin.update(req, res, user);
                } else {
                    
                    const user = {
                        id: parseInt(req.params.id),
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        picture: cuser.picture,
                        valid: 'false',
                    }
                    var admin = new adminModule(req.body.name, req.body.email, req.body.phone, '');
                    admin.update(req, res, user);
                }

            }else{
                req.flash('error','All Field Are Required');
                res.redirect('/admin/k04SuperInspireAccountsk04/profile');
            }
        })

}

module.exports.emailVerif = async (req,res)=>{
    const flash=await req.flash();
    const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
    res.render('admin/auth/emailVerif',{user:user,message:flash});
}


const nodemailer= require("nodemailer");
module.exports.sendVerification = async (req,res)=>{
    const number =Math.floor(Math.random() * 10000000);
    const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
    let transporter = nodemailer.createTransport({
        service : "gmail",
        host: "http://localhost:3000/",
        port: 587, //465
        secure: false, //true
        auth : {
            user: process.env.EMAIL_ADRESS,
            pass: process.env.EMAIL_PASS,
        },
    })

    let info = await transporter.sendMail({
        from: `${process.env.EMAIL_PASS}`, // sender address
        to: `${user.email}`, // list of receivers
        subject: "Verify your Email", // Subject line
        text: "Verify your Email", // plain text body
        html: `
                        <body >
                            <div style=" margin: auto; text-align: center; margin-top: 3%; background-color: #E5E5E5  ; width: 500px; border-radius: 10px;">
                             <h1>Email Verification</h1>    
                             <br>
                             <br>
                                <h4 >Hello : ${user.name}</h4>
                                <p> You registered an account on Inspire, before being able to use your account you need to verify that this is your email address (${user.email}) 
                                    <br> by typing this code here: <br><a style=" background-color: #8D33FF; border-radius: 5px; color: aliceblue; width: 300px;  text-align: center; font-size: 55px;"> ${number} </a>
                                </p>
                            </div>
                        </body>
                 `,
    }).catch(console.error);

    var admin = new adminModule('', '', '', '');
    await admin.insertCode(req, res, user.id , number);

}

module.exports.validate = async (req,res)=>{
    const user = await jwt.verify(req.cookies.user, process.env.TOKEN);
    var admin = new adminModule('', '', '', '');
    admin.validCode(req, res, user.id , req.body.code);
}

module.exports.updatePassword =(req,res)=>{
    const flash= req.flash();
    const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
    res.render('admin/main/change-password',{user:user,message:flash});
}

module.exports.updatePasswordAction=(req,res)=>{
    updatePassword(req,res);
}