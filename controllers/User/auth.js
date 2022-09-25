

const mysqlConnection = require('../../database/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../../../project/project/validation')
const User =require("../../../project/project/models/user");
const Payement =require("../../../project/project/models/payement");
const Bookmarks =require("../../../project/project/models/bookmarks");
const Enrolement =require("../../../project/project/models/enrolement");
const cookieParser = require('cookie-parser');

const multer = require('multer');
                         const storage = multer.diskStorage({
                             destination: function (req, file,cb) {
                                 cb(null, 'public/user/images')
                             },
                             filename: function (req, file, cb) {
                                 const mimeExtension = {
                                     'image/jpeg': '.jpeg',
                                     'image/jpg': '.jpg',
                                     'image/png': '.png',
                                     'image/gif': '.gif',
                                 }
                                 cb(null, file.fieldname + '-' + Date.now() + mimeExtension[file.mimetype]);
                             }
                         })
                         var upload = multer({
                          storage: storage,
                          fileFilter: (req, file, cb) => {
                            if (
                              file.mimetype == "image/png" ||
                              file.mimetype == "image/jpg" ||
                              file.mimetype == "image/jpeg"||
                              file.mimetype === 'image/gif'
                            ) {
                              cb(null, true);
                            } else {
                              cb(null, false);
                               cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
                            }
                          },
                          limits: { fileSize: 2000000},
                        }).single('photo');         

                        const multer1 = require('multer');
                        const storage1 = multer1.diskStorage({
                            destination: function (req, file,cb) {
                                cb(null, 'public/user/images/payement')
                            },
                            filename: function (req, file, cb) {
                                const mimeExtension = {
                                    'image/jpeg': '.jpeg',
                                    'image/jpg': '.jpg',
                                    'image/png': '.png',
                                    'image/gif': '.gif',
                                }
                                cb(null, file.fieldname + '-' + Date.now() + mimeExtension[file.mimetype]);
                            }
                        })
  var upload1 = multer1({
  storage: storage1,
                         fileFilter: (req, file, cb) => {
                           if (
                             file.mimetype == "image/png" ||
                             file.mimetype == "image/jpg" ||
                             file.mimetype == "image/jpeg"||
                             file.mimetype === 'image/gif'
                           ) {
                             cb(null, true);
                           } else {
                             cb(null, false);
                              cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
                           }
                         },
                         limits: { fileSize: 2000000},
                        }).single('photo_payement');   

exports.register = async (req,res,next)=>{
  console.log('niveau'+ req.body.Niveau)
    var user = new User('',req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
     user.register(req,res);
     }
exports.login = async (req,res,next)=>{
   var user = new User('',req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
    user.login(req,res);
    }
exports.getdashboard =async (req,res,next)=>{
        
  token= req.cookies['auth-token']
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
 let theemail = decoded.email;
 let theid = decoded.id;
 
var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,theemail,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
user.getdashboard(req,res);
              }
              exports.getmycourses =async (req,res,next)=>{
    
                token= req.cookies['auth-token']
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
               
               let theid = decoded.id;
              var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,req.body.email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
              user.getmycourses(req,res);
                            }
                            exports.getbookmarks =async (req,res,next)=>{
                              token= req.cookies['auth-token']
                              const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                             
                             let theid = decoded.id;
              console.log("l id ===="+theid)
                              var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,req.body.email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
                              user.getbookmarks(req,res);
                                            }
                                            exports.getmessages =async (req,res,next)=>{
    
                                              token= req.cookies['auth-token']
                                              const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                                             
                                             let theid = decoded.id;
                                              var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,req.body.email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
                                              user.getmessages(req,res);
                                                            }
                                                            exports.getpayement =async (req,res,next)=>{
    
                                                              token= req.cookies['auth-token']
                                                              const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                                                             
                                                             let theid = decoded.id;
                                                              var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,req.body.email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
                                                              user.getpayement(req,res);
                                                                            }


                                                           exports.pay =async (req,res,next)=>{
 upload1(req, res, function (err) {
        if(!req.file){
         // return res.redirect('/payement/?error=' + encodeURIComponent('veillez ajouter une photo'))
          req.flash('message','veillez ajouter une photo')
    return res.redirect("/payement")
        }
        else if (err instanceof multer1.MulterError) {
          // A Multer error occurred when uploading.
      
        //  return res.send(err)
         // return res.redirect('/payement/?error=' + encodeURIComponent(err))
          req.flash('message',encodeURIComponent(err))
    return res.redirect("/payement")
        } else if (err) {
          // An unknown error occurred when uploading.
      // return res.redirect('/payement/?error=' + encodeURIComponent(err))
       req.flash('message',encodeURIComponent(err))
       return res.redirect("/payement")
        }
        
       else{
        token= req.cookies['auth-token']
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
         
         let theid = decoded.id;
 // Everything went fine.
 var payement = new Payement('',req.body.code_payement,req.body.somme,req.body.commentaire,req.file.filename,'pending',theid,'');
 payement.pay(req,res);
       }
          })                                                            
                           
                                                                                            }


     exports.getprofile =async (req,res,next)=>{
        
       
////////
const search_params = req.url.searchParams;

// get url parameters
//const id = search_params.get('error');
//const type = search_params.get('type');

// "123"
console.log(req.query.error);

token= req.cookies['auth-token']
          const decoded1 = jwt.verify(token, process.env.TOKEN_SECRET)
         
         let theid = decoded1.id;

///////
      var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,'',req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
      user.getprofile(req,res);
                    }

              


    exports.updateProfile = async (req,res,next)=>{ 
        token= req.cookies['auth-token']
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
       let theemail = decoded.email;
        console.log();
      upload(req, res, function (err) {
        if(!req.file){
         // return res.redirect('profile/?error=' + encodeURIComponent('veillez ajouter une photo'))
         req.flash('message','Please add a photo!!')
         return res.redirect("/profile")
        }
        else if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
      
        //  return res.send(err)
          //return res.redirect('profile/?error=' + encodeURIComponent(err))
          req.flash('message',err)
          return res.redirect("/profile")
        } else if (err) {
          // An unknown error occurred when uploading.
       //return res.redirect('profile/?error=' + encodeURIComponent(err))
       req.flash('message',err)
       return res.redirect("/profile")
        }
        
       else{
 // Everything went fine.
 token= req.cookies['auth-token']
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
         
         let theid = decoded.id;
         var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,theemail,req.body.Phone,req.body.Gender,req.file.filename,req.body.Niveau,req.body.Password);
         user.updateProfile(req,res);
       }
          })
    ;}


exports.geteditProfile = (req,res)=>{
console.log(req.params.id);
mysqlConnection.query("SELECT * FROM user where id=?",[req.params.id], (err, rows, fields) => {
  !err ? res.render('editProfile', { data: rows }) : console.log(err);
});

}
exports.geteditPassword = (req,res)=>{
  console.log(req.params.id);
  mysqlConnection.query("SELECT * FROM user where id=?",[req.params.id], (err, rows, fields) => {
    !err ? res.render('editPassword', { data: rows }) : console.log(err);
  });
  
  }

exports.editProfile = (req,res)=>{
  console.log(req.params.id);
  token= req.cookies['auth-token']
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
 
 let theid = decoded.id;
  var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
      user.editProfile(req,res);
  
  }

  exports.editPassword = (req,res)=>{
    console.log(req.params.id);
    token= req.cookies['auth-token']
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
         
         let theid = decoded.id;
    var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.NewPassword);
        user.editPassword(req,res);
  
    }

    exports.gethome = (req,res)=>{
     
      var user = new User('',req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
          user.gethome(req,res);
      
      }

      exports.getcoursessingle = (req,res)=>{
        
        var user = new User('',req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
            user.getcoursessingle(req,res);
        
        }
        exports.getlessonsingle = (req,res)=>{
          token= req.cookies['auth-token']
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
         
         let theid = decoded.id;
          var user = new User(theid,req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
              user.getlessonsingle(req,res);
          
          }
          exports.getcourseslist = (req,res)=>{
            
            var user = new User('',req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
                user.getcourseslist(req,res);
            
            }
            exports.gotofiltredlist = (req,res)=>{
            


              var user = new User('',req.body.Name,req.body.fName,req.body.lName,req.body.Email,req.body.Phone,req.body.Gender,req.body.photo,req.body.Niveau,req.body.Password);
                  user.gotofiltredlist(req,res);
              
              }          
        


        exports.addtobookmarks = (req,res)=>{
          token= req.cookies['auth-token']
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
         
         let theid = decoded.id;
          var bookmarks = new Bookmarks('',theid,req.params.id);
              bookmarks.addtobookmarks(req,res);
          
          }
          exports.deletefrombookmarks = (req,res)=>{
            token= req.cookies['auth-token']
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
           
           let theid = decoded.id;
            var bookmarks = new Bookmarks(req.params.id,theid,req.params.id);
                bookmarks.deletefrombookmarks(req,res);
            
            }
          exports.addtoenrolement = (req,res)=>{
            token= req.cookies['auth-token']
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
           
           let theid = decoded.id;
            var enrolement = new Enrolement('',theid,req.params.id);
                enrolement.addtoenrolement(req,res);
            
            }


exports.logout = (req, res) => {
    res.clearCookie('auth-token');
    //res.json({'loggedout': "logged out"});
    res.redirect("/");
}