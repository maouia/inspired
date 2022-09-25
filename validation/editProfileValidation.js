const yup = require('yup');

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    userName: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.number().required(),
    cin: yup.number().required(),
    levelOfStudy: yup.string().required()
});

module.exports = schema;