const Joi = require("joi");
const { Status } = require("../../config/constant");

const BrandDataDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  logo: Joi.string().allow(null, "").optional().default(null),
  data: Joi.any().allow(null, "").optional().default(null),
  status: Joi.string()
    .regex(/^(active|inactive)$/)
    .default(Status.INACTIVE),
  isfeatured: Joi.boolean().required().default(false),
});
module.exports = BrandDataDTO;
