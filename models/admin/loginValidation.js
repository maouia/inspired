const yup = require('yup')
const loginSchema= yup.object({
    email : yup.string().required().email(),
    password: yup.string().required().min(8)
})
module.exports = loginSchema;