const jwt = require("jsonwebtoken");
const {getAll,addTeacher,updatePassword,deleteTeacher} = require('../../models/admin/teacher.model');


module.exports.listTeacher = (req,res)=>{
    getAll(req,res);
}

module.exports.addTeacher = (req,res)=>{
    const user =  jwt.verify(req.cookies.user, process.env.TOKEN);
    const flash= req.flash();
    res.render('admin/main/addUser',{user:user,message:flash});
}


const nodemailer= require("nodemailer");
module.exports.addAction = async (req,res)=>{
    let pass = (Math.random() + 1).toString(36).substring(2);
    let transporter = nodemailer.createTransport({
        service : "gmail",
        host: "http://localhost:3000/",
        port:587 , // 465
        secure:false , // true
        auth : {
            user: process.env.EMAIL_ADRESS,
            pass: process.env.EMAIL_PASS,
        },
    })


    let info = await transporter.sendMail({
        from: `${process.env.EMAIL_PASS}`, // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "Verify your Email", // Subject line
        text: "Verify your Email", // plain text body
        html: `
                        <body >
                            <div style=" margin: auto; text-align: center; margin-top: 3%; background-color: #E5E5E5  ; width: 500px; border-radius: 10px;">
                             <h1>Email Verification</h1>    
                             <br>
                             <br>
                                <h4 >Hello : ${req.body.name}</h4>
                                <p> You registered an account on Inspire, before being able to use your account you need to verify that this is your email address (${req.body.email}) 
                                    <br> By This Generated Password: <br><a style=" background-color: #8D33FF; border-radius: 5px; color: aliceblue; width: 300px;  text-align: center; font-size: 55px;"> ${pass} </a>
                                </p>
                            </div>
                        </body>
                 `,
    },(err,info)=>{
        if(err){
            req.flash('error','Cant Send Pass For Teacher');
            res.redirect('/admin/k04SuperInspireAccountsk04/add/teacher');
        }
        if (info){
            addTeacher(req,res,pass)
        }
    });
}


module.exports.newPass =async (req,res)=>{
    let pass = (Math.random() + 1).toString(36).substring(2);
    let transporter = nodemailer.createTransport({
        service : "gmail",
        host: "http://localhost:3000/",
        port:587 , // 465
        secure:false , // true
        auth : {
            user: process.env.EMAIL_ADRESS,
            pass: process.env.EMAIL_PASS,
        },
    })

    let info = await transporter.sendMail({
        from: `${process.env.EMAIL_PASS}`, // sender address
        to: `${req.params.email}`, // list of receivers
        subject: "Verify your Email", // Subject line
        text: "Verify your Email", // plain text body
        html: `
                        <body >
                            <div style=" margin: auto; text-align: center; margin-top: 3%; background-color: #E5E5E5  ; width: 500px; border-radius: 10px;">
                             <h1>Email Verification</h1>    
                             <br>
                             <br>
                                <h4 >Hello : ${req.params.name}</h4>
                                <p> The Systhem did Generate a new password for the user with this email  (${req.params.email}) 
                                    <br>New Generated Password: <br><a style=" background-color: #8D33FF; border-radius: 5px; color: aliceblue; width: 300px;  text-align: center; font-size: 55px;"> ${pass} </a>
                                </p>
                            </div>
                        </body>
                 `,
    },(err,info)=>{
        if(err){
            req.flash('error','Cant Generate password');
            res.redirect('/admin/k04SuperInspireAccountsk04/teacher/list');
        }if(info){
            updatePassword(req,res,pass)
        }
    });
}

module.exports.delete = (req,res)=>{
    deleteTeacher(req,res)
}
