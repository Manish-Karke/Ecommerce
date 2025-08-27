import Joi from "joi";

// For creating a new cart
export const createCartSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // ObjectId format
    .required(),

  sessionId: Joi.string().allow(null).default(null),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        priceAtAddition: Joi.number().precision(2).required(),
      })
    )
    .min(1)
    .required(),
});

// For updating an existing cart
export const updateCartSchema = Joi.object({
  sessionId: Joi.string().allow(null),

  items: Joi.array().items(
    Joi.object({
      productId: Joi.string(),
      quantity: Joi.number().integer().min(1),
      priceAtAddition: Joi.number().precision(2),
    })
  ),
}).min(1);
