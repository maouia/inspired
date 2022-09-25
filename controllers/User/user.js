require('dotenv').config();
const db = require('../../database/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const path = require('path');
const moment = require('moment');

// GET The Login Page
const getLoginPage = (req, res) => {
    return res.render('student/login');
};

// GET The Sign Up Page
const getSignupPage = (req, res) => {
    return res.render('student/signup');
}

// GET Dashboard Page 
const getDashboardPage = (req, res) => {
    return res.render('student/dashboard', { user: req.user });
}

// GET The Edit Profile Page
const getEditProfilePage = (req, res) => {
    return res.render('student/edit-profile', { user: req.user });
}

// Get the Messages Page
const getMessagesPage = (req, res) => {
    let sql = `SELECT id_formateur FROM formation, enroulement WHERE formation.id_form = enroulement.id_formation AND enroulement.id_etudiant = ${req.user.id}`;
    db.query(sql, (err, result1) => {
        if (err) throw err;
        if (result1.length === 0 ) return res.redirect(`/dashboard?error=${encodeURIComponent('You Must By At Least One Formation To Become Have An Access To The Messages Page ')}`);
        let arr = [];
        result1.forEach(ele => {
            let sql = `SELECT email, trainerName, avatar, nom_form FROM formateur, formation WHERE formateur.id_formateur = ${ele.id_formateur} AND formation.id_formateur = ${ele.id_formateur}`;
            db.query(sql, (err, result) => {    
                if (err) throw err;
                result[0].id_formateur = ele.id_formateur;
                arr.push(result[0]);
                if (arr.length === result1.length) {

                    const key = 'id_formateur';

                    const arrayUniqueByKey = [...new Map(arr.map(item => [item[key], item])).values()];

                    return res.render('student/dshb-messages', { user: req.user, contacts: arrayUniqueByKey });
                }
            });
        });
    });
}
// Get Chat With SomeOne Page
const getChatWithSomeOnePage = (req, res) => {
    let sql = `SELECT id_formateur, trainerName, email, phone, avatar, role FROM formateur WHERE id_formateur = '${req.params.id}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        let sql = `SELECT contenu, whosTheSender, time FROM message WHERE id_etudiant = ${req.user.id} AND id_formateur = ${result[0].id_formateur}`;
        db.query(sql, (err, result2) => {
            if (err) throw err;
            
            if (result2.length > 0 ) {
                let whoSend = '';
                let arr = [];
                result2.forEach(message => {
                    if (req.user.id === message.whosTheSender) {
                        whoSend = 'me';
                    } else {
                        whoSend = 'not me';
                    }
                    message.whoSend = whoSend;
                    arr.push(message);

                    if (arr.length === result2.length) {
                        return res.render('chat-with-someone', { user: req.user, info: result[0], messages: arr });
                    }
                });
            } else {
                return res.render('student/chat-with-someone', { user: req.user, info: result[0], messages: result2 });
            }
        });
    });
}
// Get Student Courses Page
const getStudentCoursesPage = (req, res) => {
    let sql = `SELECT id_formation FROM enroulement WHERE id_etudiant = ${req.user.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;

        if (result.length === 0) return res.redirect(`/by-courses?error=${encodeURIComponent(`you don't have any course yet by a course now from here `)}`);
        
        let arr = [];
        result.forEach(ele => {
            let sql = `SELECT * FROM formation WHERE id_form = ${ele.id_formation}`;
            db.query(sql, (err, result2) => {
                if (err) throw err;

                arr.push(result2[0]);

                if (arr.length === result.length) {
                    return res.render('student/student-courses', { user: req.user, myCourses: arr });
                }

            });
        });
    });
}

// Store Private User Messages
const storePrivateMessages = (req, res) => {
    const { message } = req.body;

    let sql = `INSERT INTO message SET ?`;
    db.query(sql, { id_etudiant: req.user.id, id_formateur: req.params.id, contenu: message, whosTheSender: req.user.id, time: moment().format('h:mm a') }, (err, rows) => {
        if (err) throw err;
        return res.redirect(`/start-chating/with/${req.params.id}`);
    });
};

// Get By Courses Page
const getByCoursesPage = (req, res) => {
    let sql = `SELECT * FROM formation`;

    db.query(sql, (err, result) => {
        if(err) throw err;

        return res.render('student/by-courses', { user: req.user, allCourses: result });
    });
}

// Login A User
const login = (req, res) => {
    const { email, password } = req.body;
    
    let sql = `SELECT email FROM user WHERE email = '${email}'`;
    
    db.query(sql, (err, result) => {

        if (err) throw err;
        
        if (result.length === 0) return res.redirect(`/login?error=${encodeURIComponent('no account under thart email ')}`);
            
        let sql = `SELECT * FROM user WHERE email = '${email}'`;
        
        db.query(sql, async(err, result) => {

            if (err) throw err;

            if (!await bcrypt.compare(password, result[0].password)) return res.redirect(`/login?error=${encodeURIComponent('password incorrect')}`);
            
            const token = jwt.sign({ id: result[0].id, role: result[0].role }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRES
            });

            const cookieOptions = {
                expiresIn: new Date( Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 ),
                httpOnly: true
            };

            res.cookie('auth-token', token, cookieOptions);

            return res.redirect('/dashboard');
        });
    });
}

// Sign Up A User
const signup = (req, res) => {
    const { firstName, lastName, userName, email, password, passwordConfirm, phone, cin, gender, birthday, levelOfStudy } = req.body;
    if (phone.length !== 8 || cin.length !== 8) return res.redirect(`/signup?error=${encodeURIComponent('the length of the cin and the phone equal to 8')}`);
    
    if (cin[0] !== '0' && cin[0] !== '1') return res.redirect(`/signup?error=${encodeURIComponent('cin must start with "0" or "1"')}`);

    if (password !== passwordConfirm) return res.redirect(`/signup?error=${encodeURIComponent('passwords do not mutch ')}`);

    let sql = `SELECT id, email FROM user WHERE email = '${email}'`;

    db.query(sql, async (err, result) => {
        if (err) throw err;

        if (result.length > 0) return res.redirect(`/signup?error=${encodeURIComponent('that email already in use')}`);

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let sql = `INSERT INTO user SET ?`;

        db.query(sql, { firstName, lastName, userName, email, password: hashedPassword, phone, cin, gender, birthday, levelOfStudy, role: 'student' }, (err, row) => {
            if (err) throw err;

            let sql = `SELECT * FROM user WHERE email = '${email}'`;
            
            db.query(sql, (err, result) => {
                if (err) throw err;
                
                const token = jwt.sign({ id: result[0].id, role: result[0].role }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRES
                });

                const cookieOptions = {
                    expiresIn: new Date( Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 ),
                    httpOnly: true
                };
    
                res.cookie('auth-token', token, cookieOptions);
    
                return res.redirect('/dashboard');
            });
        });
    });
};

// Edit The Information About The User
const editProfile = (req, res) => {
    const { firstName, lastName, userName, email, phone, cin, gender, birthday, levelOfStudy } = req.body;

    if (phone.length !== 8 || cin.length !== 8) return res.redirect(`/profile/edit-profile/${req.params.id}?error=${encodeURIComponent('the length of the cin and the phone equal to 8')}`);
    
    if (cin[0] !== '0' && cin[0] !== '1') return res.redirect(`/profile/edit-profile/${req.params.id}?error=${encodeURIComponent('cin must start with "0" or "1"')}`);

    let sql = `UPDATE user SET ? WHERE id = ${req.params.id}`;

    db.query(sql, { firstName, lastName, userName, email, phone, cin, gender, birthday, levelOfStudy }, (err, row) => {
        if (err) throw err;

        return res.redirect(`/profile/edit-profile/${req.params.id}?success=${encodeURIComponent('profile information updated successfully')}`);
    });
};

// Edit (Change) The Pasword
const editPassword = (req, res) => {
    const { currentPassword, password, retypedPassword } = req.body;

    let sql = `SELECT password FROM user WHERE id = ${req.params.id}`;

    db.query(sql, async (err, result) => {
        if (err) throw err;

        if (!await bcrypt.compare(currentPassword, result[0].password)) return res.redirect(`/profile/edit-profile/${req.params.id}?error=${encodeURIComponent('password incorrect')}`);

        if (password !== retypedPassword) return res.redirect(`/profile/edit-profile/${req.params.id}?error=${encodeURIComponent('passwords do not mutch')}`);

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let sql = `UPDATE user SET password = '${hashedPassword}' WHERE id = ${req.params.id}`;

        db.query(sql, (err, row) => {
            if (err) throw err;

            return res.redirect(`/profile/edit-profile/${req.params.id}?success=${encodeURIComponent('password changed successfully')}`);
        });
    });
};

const byACourse = (req, res) => {
    let sql = `SELECT solde FROM user WHERE id = ${req.user.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;

        if (result[0].solde === 0 ) return res.redirect(`/by-courses?error=${encodeURIComponent(`You don't have balance to buy any course, please charge your account`)}`);

        let sql = `SELECT nom_form, prix, id_formateur FROM formation WHERE id_form = ${req.params.id}`;
        db.query(sql, (err, result2) => {
            if (err) throw err;

            if (result2[0].prix > result[0].solde) return res.redirect(`/by-courses?error=${encodeURIComponent(`You don't have enough balance to buy a course`)}`);

            let sql = `INSERT INTO enroulement SET ?`;
            db.query(sql, {id_formation: req.params.id, id_etudiant: req.user.id, id_format: result2[0].id_formateur}, (err, rows) => {
                if (err) throw err;

                let sql = `UPDATE user SET solde = solde - ${result2[0].prix} WHERE id = ${req.user.id}`;
                db.query(sql, (err, rows) => {
                    if (err) throw err;

                    let sql = `SELECT email FROM formateur WHERE id_formateur = ${result2[0].id_formateur}`;
                    db.query(sql, (err, result3) => {
                        if (err) throw err;

                        const transporter = nodeMailer.createTransport({
                            service: 'gmail',
                            auth : {
                                user: 'bilelbenmrad2001@gmail.com',
                                pass: 'cghbpakvhlqkojny'
                            }
                        });

                        const mailOptions = {
                            from: 'bilelbenmrad2001@gmail.com',
                            to: `${result3[0].email}`,
                            subject: 'Email From Inspire Platform',
                            html: `<h3> Hello Sir Your ${result2[0].nom_form} Course  has been purchased</h3>`
                        };

                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) throw err;
                            
                        });
                        return res.redirect(`/by-courses?success=${encodeURIComponent('You Buy This Course')}`);
                    });
                });
            });
        });
    });
}

module.exports = {getLoginPage, getSignupPage, getDashboardPage, getEditProfilePage, getMessagesPage, getChatWithSomeOnePage, getStudentCoursesPage, getByCoursesPage, login, signup, editProfile, editPassword, storePrivateMessages, byACourse};
