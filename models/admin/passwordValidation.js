const yup = require('yup')
const passwordSchema= yup.object({
    cPass : yup.string().required(),
    newPass : yup.string().required(),
    newPass2: yup.string().required()
})
module.exports = passwordSchema;