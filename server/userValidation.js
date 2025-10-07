const Joi = require("joi");
exports.validateResigter=(data)=>{
    const schema=Joi.object({

        name: Joi.string().min(3).max(25).required(),
        email: Joi.string().email().required(),
        password:Joi.string().min(6).required(),
        role: Joi.string().valid("user", "admin").default("user"),
    })
    return schema.validate(data)
}