const yup = require('yup')
const teacherSchema= yup.object({
    fname : yup.string().required(),
    lname : yup.string().required(),
    sex : yup.string().required(),
    cin : yup.string().required().length(8),
    phone : yup.string().required().min(8),
    email : yup.string().required().email(),
    birthday : yup.date().required(),

})
module.exports = teacherSchema;