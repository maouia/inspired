const yup = require('yup');

const schema = yup.object({
    nom_form: yup.string().required(),
    category: yup.string().required()    
});

module.exports = schema;