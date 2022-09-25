const { Router } = require('express');
const router = Router();

// Global Functions
const { getHomePage, logout } = require('../controllers/auth');

// User Functions 
const { getLoginPage, getSignupPage, getDashboardPage, getEditProfilePage, getMessagesPage, getChatWithSomeOnePage, getStudentCoursesPage, getByCoursesPage, login, signup, editProfile, editPassword, storePrivateMessages, byACourse} = require('../controllers/User/user')

// Teacher Functions
const { getTrainerDashboardPage,  getTrainerMessagesPage, getTrainerLoginPage, getEditTrainerProfilePage, getChatWithAStudentPage, getCreateCoursePage, getTrainerCourses, getEditCoursePage, editTrainerProfile, trainerLogin, editTrainerPassword, storePrivateTrainerMessages, createCourse } = require('../controllers/Teacher/teacher');

// Upload Files Functions
const { editUserAvatar, editTrainerAvatar } = require('../controllers/Uploading/profiles');
const { addVideo } = require('../controllers/Uploading/uploadVideo');
const { editCourseThubmnail } = require('../controllers/Uploading/uploadCourseThubmnails');

// Middelwares
const loggedin = require('../middlewares/loggedin');
const loggedout = require('../middlewares/loggedout');
const trainerLoggedin = require('../middlewares/trainerLoggedin');

// Function For Validation Form Fileds
const validation = require('../middlewares/userValidationMiddleware');

// Scheamas To Every Form
const loginSchema = require('../validation/loginValidation');
const signupSchema = require('../validation/signupValidations');
const editProfileSchema = require('../validation/editProfileValidation');
const editPasswordSchema = require('../validation/editPasswordValidation');
const chatSchema = require('../validation/chatValidation');
const trainereditProfileSchema = require('../validation/trainereditProfileValidation');
const createCourseSchema = require('../validation/createCourseValidation');

// Global Request (Used By The User And The Teacher)
router.get('/', getHomePage);

// Start User Requests Section

/*router.get('/dashboard', loggedin, getDashboardPage);
router.get('/logout', loggedin, logout);
router.get('/by-courses', loggedin, getByCoursesPage);
router.get('/student-courses', loggedin, getStudentCoursesPage);
router.post('/profile/edit-avatar/:id', editUserAvatar);
router.post('/profile/edit-password/:id', validation(editPasswordSchema), editPassword);
router.post('/by-course/:id', loggedin, byACourse);
router.route('/login').get(loggedout, getLoginPage).post(validation(loginSchema), login);
router.route('/signup').get(loggedout, getSignupPage).post(validation(signupSchema), signup);
router.route('/profile/edit-profile/:id').get(loggedin, getEditProfilePage).post(validation(editProfileSchema), editProfile);
router.route('/start-chating').get(loggedin, getMessagesPage);
router.route('/start-chating/with/:id').get(loggedin, getChatWithSomeOnePage).post(loggedin, validation(chatSchema), storePrivateMessages);
*/

// End User Section

// Start Teacher Requests Section 
router.get('/trainer-dashboard', trainerLoggedin, getTrainerDashboardPage);
router.get('/trainer-courses', trainerLoggedin, getTrainerCourses);
router.get('/edit-course/:id', trainerLoggedin, getEditCoursePage);
router.post('/edit-course-thubmnail/:id', editCourseThubmnail);
router.post('/add-video/:id', trainerLoggedin, addVideo);
router.post('/profile/edit-trainer-avatar/:id', editTrainerAvatar);
router.post('/profile/edit-trainer-password/:id', validation(editPasswordSchema), editTrainerPassword);
router.route('/trainer-login').get(loggedout, getTrainerLoginPage).post(validation(loginSchema), trainerLogin);
router.route('/trainer-contact').get(trainerLoggedin, getTrainerMessagesPage);
router.route('/profile/edit-trainer-profile/:id').get(trainerLoggedin, getEditTrainerProfilePage).post(validation(trainereditProfileSchema), editTrainerProfile);
router.route('/start-chating/with-student/:id').get(trainerLoggedin, getChatWithAStudentPage).post(trainerLoggedin, validation(chatSchema), storePrivateTrainerMessages);
router.route('/create-course/:id').get(trainerLoggedin, getCreateCoursePage).post(validation(createCourseSchema), createCourse);
// End User Section

module.exports = router;