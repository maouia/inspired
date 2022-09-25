const yup = require('yup');

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required()    
});

module.exports = schema;