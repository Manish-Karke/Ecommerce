// src/middleware/middleware.validate.js

const userValidator = (schema) => {
  return async (req, res, next) => {
    try {
      // If no schema passed → skip validation
      if (!schema) {
        return next();
      }

      // Validate only req.body (multer already handled files)
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true, // Important for multer file uploads
      });

      if (error) {
        const errors = {};
        error.details.forEach((err) => {
          errors[err.path.join(".")] = err.message;
        });

        return res.status(400).json({
          message: "Validation failed",
          errors,
          status: 400,
        });
      }

      // Replace req.body with cleaned data
      req.body = value;
      next();
    } catch (err) {
      console.error("Validation middleware error:", err);
      res.status(500).json({
        message: "Server error during validation",
        status: 500,
      });
    }
  };
};

module.exports = userValidator;