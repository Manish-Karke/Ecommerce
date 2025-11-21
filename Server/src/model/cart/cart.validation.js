// middlewares/cart.validation.js
const Joi = require("joi");

const itemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  priceAtAddition: Joi.number().positive().required(),
});

exports.validateAddItem = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().optional(),
    sessionId: Joi.string().optional(),
    items: Joi.array().items(itemSchema).min(1).required(),
  }).or("userId", "sessionId");

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  next();
};

exports.validateUpdateQuantity = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().optional(),
    sessionId: Joi.string().optional(),
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  }).or("userId", "sessionId");

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  next();
};
