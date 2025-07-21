const Joi = require("joi")

const CategoryDataDTO = Joi.object({
  name:Joi.string().min(3).max(50).required(),
  image:Joi.string().allow(" ",null).optional().default(null),
  data:Joi.string().allow("",null).optional().default(null),
  status:Joi.string().regex(/^(active|inactive)$/).default("inactive"),
  isFeatured:Joi.boolean().required(),
  parentId:Joi.string().allow("",null).optional().
  default(null),
  brandId:Joi.array().items(Joi.string()).allow("",null).optional().
  default(null)

})

module.exports= CategoryDataDTO;