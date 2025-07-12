const Joi = require("joi");
const { Status } = require("../../config/constant");

const ProductValidationDTO = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  images: Joi.string().allow("", null).optional().default(null),
  description: Joi.string().required(),
  isFeatured: Joi.boolean().required(),
  isMenu: Joi.boolean().allow("", null).optional().default(false),
  status: Joi.string()
    .regex(/^(inactive|active)$/)
    .default(Status.INACTIVE).required(),
  price: Joi.number().min(100).required(),
  discount: Joi.number().max(90).allow("", null).optional().default(0),
  order: Joi.number().allow("", null).optional().default(0),
  stock: Joi.number().allow("", null).optional().default(0),
  categoryId: Joi.array()
    .items(Joi.string())
    .allow("", null)
    .optional()
    .default(null),
  brandId: Joi.array()
    .items(Joi.string())
    .allow("", null)
    .optional()
    .default(null),
  seller: Joi.string().allow(null, "").optional().default(null),
});
module.exports = ProductValidationDTO