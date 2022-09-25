require('dotenv').config();
const db = require('../../database/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const path = require('path');
const moment = require('moment');

// Get trainer Dashboard Page
const getTrainerDashboardPage = (req, res) => {
    return res.render('teacher/trainer-dashboard', { user: req.user });
}

// Get the Trainer Messages Page
const getTrainerMessagesPage = (req, res) => {
    let sql = `SELECT id_form FROM formation WHERE id_formateur = ${req.user.id_formateur}`;
    db.query(sql, (err , result1) => {
        if (err) throw err;
        
        if (result1.length === 0 ) return res.redirect(`/trainer-dashboard?error=${encodeURIComponent('Yu Must Create At Least One Course To Be Have A Contact With Your Students ')}`);
        
        let sql = `SELECT id FROM user, enroulement WHERE user.id = enroulement.id_etudiant AND enroulement.id_format = ${req.user.id_formateur}`;
        
        db.query(sql, (err, result2) => {
            if (err) throw err;

            if (result2.length === 0) return res.redirect(`/trainer-dashboard?error=${encodeURIComponent(`You Don't Have A contact Yet , Cause No One By Your Course(s) `)}`);

            let arr = [];

            result2.forEach(ele => {
                let sql = `SELECT email, userName, avatar, role FROM user WHERE id = ${ele.id}`;

                db.query(sql, (err, result3) => {
                    if (err) throw err;
                    result3[0].id = ele.id;
                    arr.push(result3[0]);
                    if (arr.length === result2.length) {

                        const key = 'id';

                        const arrayUniqueByKey = [...new Map(arr.map(item => [item[key], item])).values()];
                        
                        return res.render('teacher/dshb-trainer-messages', { user: req.user, contacts: arrayUniqueByKey });
                    }
                });
            })
        });
    });
    
}

// Get The Trainer Login Page
const getTrainerLoginPage = (req, res) => {
    return res.render('teacher/trainer-login');
};

// Get the Edit Trainer Profile Page
const getEditTrainerProfilePage = (req, res) => {
    return res.render('teacher/edit-trainer-profile', { user: req.user });
}

// Get Chating With A student Page 
const getChatWithAStudentPage = (req, res) => {
    let sql = `SELECT id, userName, email, phone, role, avatar FROM user WHERE id = '${req.params.id}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        let sql = `SELECT contenu, whosTheSender, time FROM message WHERE id_formateur = ${req.user.id_formateur} AND id_etudiant = ${result[0].id}`;
        db.query(sql, (err, result2) => {
            if (err) throw err;
            
            if (result2.length > 0 ) {
                let whoSend = '';
                let arr = [];
                result2.forEach(message => {
                    if (req.user.id_formateur === message.whosTheSender) {
                        whoSend = 'me';
                    } else {
                        whoSend = 'not me';
                    }
                    message.whoSend = whoSend;
                    arr.push(message);

                    if (arr.length === result2.length) {
                        return res.render('chat-with-student', { user: req.user, info: result[0], messages: arr });
                    }
                });
            } else {
                return res.render('teacher/chat-with-student', { user: req.user, info: result[0], messages: result2 });
            }
        });
    });
}

// Get Create Course Page
const getCreateCoursePage = (req, res) => {
    let sql = `SELECT * FROM categories`;

    db.query(sql, (err, result) => {
        if (err) throw err;

        return res.render('teacher/dshb-create-course', { user: req.user, categories: result});
    });
}

// Get All Trainer Courses
const getTrainerCourses = (req, res) => {
    let sql = `SELECT * FROM formation WHERE id_formateur = ${req.user.id_formateur}`;
    db.query(sql, (err, result) => {
        if (err) throw err;

        return res.render('teacher/trainer-courses', { user: req.user, myCourses: result });
    });
}

// Get Edit Course Page
const getEditCoursePage = (req, res) => {
    let sql = `SELECT thubmnail FROM formation WHERE id_form = ${req.params.id}`;

    db.query(sql, (err, result) => {
        if (err) throw err;

        return res.render('teacher/edit-course', { user: req.user, courseId: req.params.id, thubmnail: result[0].thubmnail });
    });
}

// Edit Trainer Profile
const editTrainerProfile = (req, res) => {
    const { firstName, lastName, trainerName, email, phone, cin, gender, birthday } = req.body;

    if (phone.length !== 8 || cin.length !== 8) return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?error=${encodeURIComponent('the length of the cin and the phone equal to 8')}`);
    
    if (cin[0] !== '0' && cin[0] !== '1') return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?error=${encodeURIComponent('cin must start with "0" or "1"')}`);

    let sql = `UPDATE formateur SET ? WHERE id_formateur = ${req.params.id}`;

    db.query(sql, { firstName, lastName, email, trainerName,  phone, cin, birthday, gender }, (err, row) => {
        if (err) throw err;

        return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?success=${encodeURIComponent('profile information updated successfully')}`);
    });
}

const trainerLogin = (req, res) => {
    const { email, password } = req.body;
    
    let sql = `SELECT email FROM formateur WHERE email = '${email}'`;
    
    db.query(sql, (err, result) => {

        if (err) throw err;
        
        if (result.length === 0) return res.redirect(`/trainer-login?error=${encodeURIComponent('You Are Still Not A Trainer')}`);
            
        let sql = `SELECT * FROM formateur WHERE email = '${email}'`;
        
        db.query(sql, async(err, result) => {

            if (err) throw err;

            if (!await bcrypt.compare(password, result[0].password)) return res.redirect(`/trainer-login?error=${encodeURIComponent('password incorrect')}`);
            
            const token = jwt.sign({ id: result[0].id_formateur, role: result[0].role }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRES
            });

            const cookieOptions = {
                expiresIn: new Date( Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 ),
                httpOnly: true
            };

            res.cookie('auth-token', token, cookieOptions);

            return res.redirect('/trainer-dashboard');
        });
    });

};

const editTrainerPassword = (req, res) => {
    const { currentPassword, password, retypedPassword } = req.body;

    let sql = `SELECT password FROM formateur WHERE id_formateur = ${req.params.id}`;

    db.query(sql, async (err, result) => {
        if (err) throw err;

        if (!await bcrypt.compare(currentPassword, result[0].password)) return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?error=${encodeURIComponent('password incorrect')}`);

        if (password !== retypedPassword) return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?error=${encodeURIComponent('passwords do not mutch')}`);

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let sql = `UPDATE formateur SET password = '${hashedPassword}' WHERE id_formateur = ${req.params.id}`;

        db.query(sql, (err, row) => {
            if (err) throw err;

            return res.redirect(`/profile/edit-trainer-profile/${req.params.id}?success=${encodeURIComponent('password changed successfully')}`);
        });
    });
}

const storePrivateTrainerMessages = (req, res) => {
    const { message } = req.body;

    let sql = `INSERT INTO message SET ?`;
    db.query(sql, { id_etudiant: req.params.id, id_formateur: req.user.id_formateur, contenu: message, whosTheSender: req.user.id_formateur, time: moment().format('h:mm a') }, (err, rows) => {
        if (err) throw err;
        return res.redirect(`/start-chating/with-student/${req.params.id}`);
    });
}

// Create A Course 
const createCourse = (req, res) => {
    const { nom_form, category, description } = req.body;
    let sql = `INSERT INTO formation SET ?`;
    db.query(sql, { nom_form, category, description, nb_videos: 0, duree: '00:00', date_creation: moment().format('YYYY-MM-D'), id_formateur: req.params.id }, (err, rows) => {
        if (err) throw err;

        return res.redirect(`${req.url}?success=${encodeURIComponent(`course has been registerd`)}`);
    });
}

module.exports = { getTrainerDashboardPage,  getTrainerMessagesPage, getTrainerLoginPage, getEditTrainerProfilePage, getChatWithAStudentPage, getCreateCoursePage, getTrainerCourses, getEditCoursePage, editTrainerProfile, trainerLogin, editTrainerPassword, storePrivateTrainerMessages, createCourse };


