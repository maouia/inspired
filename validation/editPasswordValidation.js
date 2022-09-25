const yup = require('yup');

const schema = yup.object({
    currentPassword: yup.string().required(),
    password: yup.string().min(6).required(),
    retypedPassword: yup.string().min(6).required()
});

module.exports = schema;