const yup = require('yup');

const schema = yup.object({
    message: yup.string().required('if you want to text someone you mut right something right?'),    
});

module.exports = schema;