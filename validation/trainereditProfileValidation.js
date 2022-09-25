const yup = require('yup');

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    trainerName: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.number().required(),
    cin: yup.number().required(),
});

module.exports = schema;