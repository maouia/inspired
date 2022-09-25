var express = require('express');
var router = express.Router();
const adminAuthController = require('../controllers/admin/auth');
const adminMainController = require('../controllers/admin/main');
const adminTraining= require('../controllers/admin/training');
const loginDto = require("../middlewares/admin/login.dto");
const loginSchema = require("../models/admin/loginValidation");
const videoSchema =require('../models/admin/videoValidation');
const videoDto =require('../middlewares/admin/video.dto');
const teacherSchema =require('../models/admin/teacherValidation');
const teacherDto =require('../middlewares/admin/teacher.dto');
const passwordSchema =require('../models/admin/passwordValidation');
const passwordDto =require('../middlewares/admin/password.dto');
const adminsSchema =require('../models/admin/adminsValidation');
const adminsDto =require('../middlewares/admin/admins.dto');
const adminVideos = require('../controllers/admin/videos');
const teacherController = require('../controllers/admin/teacher');
const paymentController = require ('../controllers/admin/payment');
const adminsController = require('../controllers/admin/admins');
const {userNotExist, userExist} = require("../middlewares/admin/auth");
const {emailValidation,emailIsValidate} = require("../middlewares/admin/email");

/* GET users listing. */

//email validation 
router.get('/emailverif',userNotExist,emailIsValidate,adminMainController.emailVerif)
router.post('/emailverif',userNotExist,emailIsValidate,adminMainController.sendVerification)
router.post('/verif/email/',userNotExist,emailIsValidate,adminMainController.validate)


//admin main actions
router.get('/',userNotExist,emailValidation,adminMainController.index);
router.post('/logout',userNotExist,emailValidation,adminMainController.logout);
router.get('/profile',userNotExist,emailValidation,adminMainController.profile);
router.get('/profile/changePassword',userNotExist,emailValidation,adminMainController.updatePassword)
router.post('/profile/update/:id',userNotExist,emailValidation,adminMainController.update);
router.post('/profile/changePassword/:id',userNotExist,emailValidation,passwordDto(passwordSchema),adminMainController.updatePasswordAction);


//admin tarining action
router.get('/add/training',userNotExist,emailValidation,adminTraining.addTraining);
router.get('/list/training',userNotExist,emailValidation,adminTraining.listTraining)
router.post('/add/training/store',userNotExist,emailValidation,adminTraining.store);
router.post('/training/delete/:id',userNotExist,emailValidation,adminTraining.delete);
router.get('/update/training/:id',userNotExist,emailValidation,adminTraining.update)
router.post('/update/training/:id',userNotExist,emailValidation,adminTraining.updateAction);


//admin video actions
router.get('/training/details/:id',userNotExist,emailValidation,adminVideos.trainingDetails);
router.post('/video/uploadAction/:id',userNotExist,emailValidation,adminVideos.storeUpload);
router.post('/video/delete/:id/:fid',userNotExist,emailValidation,adminVideos.delete);


//admin teacher CRUD
router.get('/teacher/list',userNotExist,emailValidation,teacherController.listTeacher);
router.get('/add/teacher',userNotExist,emailValidation,teacherController.addTeacher);
router.post('/add/teacher',userNotExist,emailValidation,teacherDto(teacherSchema),teacherController.addAction)
router.post('/new/password/teacher/:id/:email/:name',userNotExist,emailValidation,teacherController.newPass)
router.post('/delete/teacher/:id',userNotExist,emailValidation,teacherController.delete)


//admin payment Actions
router.get('/payment/list',userNotExist,emailValidation,paymentController.getAll)
router.get('/payment/agree/:id',userNotExist,emailValidation,paymentController.getOne)
router.post('/payment/agree/:id/:uid',userNotExist,emailValidation,paymentController.agree)
router.post('/payment/reject/:id',userNotExist,emailValidation,paymentController.reject)


//Supper Admin Actions
router.get('/admin/list',userNotExist,emailValidation,adminsController.getAll);
router.get('/add/admin',userNotExist,emailValidation,adminsController.addAdmin);
router.post('/add/admin',userNotExist,emailValidation,adminsDto(adminsSchema),adminsController.addAdminAction);
router.post('/delete/admin/:id',userNotExist,emailValidation,adminsController.delete);
router.post('/new/password/admin/:id/:email/:name',userNotExist,emailValidation,adminsController.resetPassword);


//login 
router.get('/login',userExist,adminAuthController.login);
router.post('/store',userExist,loginDto(loginSchema),adminAuthController.store);


module.exports = router;