//Validation
const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
       
        
        Email: Joi.string().required().email(),
        Password: Joi.string().min(6).required(),
        Name: Joi.string(),
        fName: Joi.string(),
        lName: Joi.string(),
        Phone: Joi.string().optional().allow(''),
        Gender: Joi.string(),
        Niveau : Joi.string(),
        confirmPassword:Joi.string().required().valid(Joi.ref('Password')),
       
    });

    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        Email: Joi.string().required().email(),
        Password: Joi.string().min(6).required(),
        Name: Joi.string().optional().allow(''),
        Phone: Joi.string().optional().allow(''),
        Gender: Joi.string().optional().allow(''),
        Niveau: Joi.string().optional().allow(''),
        confirmPassword: Joi.string().optional().allow('')
    });

    return schema.validate(data);
}

const changePassword = (data) => {
    const schema = Joi.object({
       
        
        Password: Joi.string().required(),
        NewPassword:Joi.string().min(6).required(),
        confirmPassword:Joi.string().required().valid(Joi.ref('NewPassword')),
       
    });

    return schema.validate(data);
}



module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.changePassword = changePassword;