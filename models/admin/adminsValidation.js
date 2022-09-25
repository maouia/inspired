const yup = require('yup')
const adminSchema= yup.object({
    name : yup.string().required(),
    phone : yup.string().required().length(8),
    email : yup.string().required().email(),
})
module.exports = adminSchema;