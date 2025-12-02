const Joi = require("joi");
const { Roles } = require("../../config/constant");
const { userRoles } = require("../../config/const.config");

const authValidatorRegistrationDTO = Joi.object({
  username: Joi.string().min(3).max(30).trim().required(),

  email: Joi.string().email().required(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/) // Matches 10 to 15 digits
    .required(),

  role: Joi.string().valid("admin", "customer").default(userRoles.CUSTOMER),

  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,25}$/)
    .min(6)
    .max(128)
    .required(),

  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),

  location: Joi.string().min(2).max(100).required(),

  gender: Joi.string()
    .valid("male", "female", "other", "prefer not to say")
    .required(),

  dob: Joi.date().less("now").required().messages({
    "date.base": "Data can't be empty.",
    "date.less": "Date must be in past.",
  }),
});

const authValidatorLoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { authValidatorRegistrationDTO, authValidatorLoginDTO };
