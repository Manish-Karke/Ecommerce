const Joi = require("joi");

const authValidatorRegistrationDTO = Joi.object({
  email: Joi.string().email().required(),
  // phoneNumber: Joi.string()
  //   .pattern(/^[0-9]{10,15}$/)
  //   .required(),
  // role: Joi.string().valid("user", "admin", "manager").required(), // Adjust roles as needed
  password: Joi.string().min(6).required(),
  // location: Joi.string().required(),
});

const authValidatorLoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { authValidatorRegistrationDTO, authValidatorLoginDTO };
