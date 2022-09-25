const express = require('express');
const router = express.Router();
const {loggedin, loggedout} = require('../verifyToken')
const authController = require('../controllers/user/auth');
const multer  = require('multer');
const upload = multer({ dest: 'public/images' });

//authview
router.get("/",  authController.gethome);

//Signup using form
router.get("/signup",loggedout,(req,res)=>{
    res.render('user/signup',{message_error: req.flash("message")})
});
router.post("/signup",loggedout, authController.register);

//Login 
router.get("/login",loggedout,(req,res)=>{
    console.log('rr')
    res.render('user/login',{message_error: req.flash("message"),message_success: req.flash("message_success")})
});
router.post("/login",loggedout, authController.login);

//dashboard
router.get("/dashboard",loggedin,authController.getdashboard);

//profile
router.get("/profile", loggedin, authController.getprofile);
//mycourses
router.get("/courses_list", authController.getcourseslist);
router.post("/courses_list", authController.gotofiltredlist);

router.get("/courses_single/:id", authController.getcoursessingle);
router.get("/lesson_single/:id/:idvid", loggedin,authController.getlessonsingle);

router.get("/addtobookmarks/:id",loggedin,authController.addtobookmarks);
router.get("/deletefrombookmarks/:id",loggedin,authController.deletefrombookmarks);

router.get("/addtoenrolement/:id",loggedin,authController.addtoenrolement);
router.get("/mycourses",loggedin,authController.getmycourses);
router.get("/bookmarks",loggedin,authController.getbookmarks);
router.get("/messages",loggedin,authController.getmessages);
router.get("/payement",loggedin,authController.getpayement);
router.post("/payement",loggedin,authController.pay);
//update Profile 
router.post("/profile",loggedin,authController.updateProfile);
//router.get("/editprofile/:id",loggedin,authController.geteditProfile);
router.post("/editprofile/:id",loggedin,authController.editProfile);
router.get("/editpassword/:id",loggedin,authController.geteditPassword);
router.post("/editpassword/:id",loggedin,authController.editPassword);

//Logout 
router.get("/logout", loggedin, authController.logout);

router.use((req,res)=>{
    res.render("user/404");
});


const crud = require('../controllers/User/crud');

//Fetch -- view
router.get("/view", loggedin, crud.fetch);
//Insert
router.post("/create", loggedin, crud.insert);
//update
router.post("/:id/update", loggedin,crud.update);
//Delete using form
router.get("/:id/delete", loggedin, crud.delete);

module.exports = router;