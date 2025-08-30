const Joi = require("joi");

exports.validateAddItem = (req, res, next) => {
  const itemSchema = Joi.object({
    productId: Joi.string().required(),

    quantity: Joi.number().min(1).required(),

    priceAtAddition: Joi.number().required(),
  });

  const schema = Joi.object({
    userId: Joi.string().optional(),

    sessionId: Joi.string().optional(),

    items: Joi.array().items(itemSchema).required(), // items should be an array of objects
  }).or("userId", "sessionId");

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

exports.validateUpdateQuantity = (req, res, next) => {
  // Define the schema for a single item within the array
  const itemSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    priceAtAddition: Joi.number().optional(), // Make this optional if not always provided
  });

  const schema = Joi.object({
    userId: Joi.string().optional(),
    sessionId: Joi.string().optional(),

    items: Joi.array().items(itemSchema).required(),
  }).or("userId", "sessionId");

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
