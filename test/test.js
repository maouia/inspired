//console.log(Math.floor(Math.random() * 10000));
//console.log(new Date().toISOString().split('T')[0]);

/*const bcrypt = require('bcrypt');
const saltRounds = 14;

let pass=''
bcrypt.hash('test', 14).then(function(hash) {
    // Store hash in your password DB.

});

console.log(pass)*/

let r = (Math.random() + 1).toString(36).substring(2);
//console.log( r);