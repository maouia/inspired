const yup = require('yup')
const loginSchema= yup.object({
    name : yup.string().required(),
    details: yup.string().required()
})
module.exports = loginSchema;