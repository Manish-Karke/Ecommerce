const userValidator = (rules) => {
  return async (req, res, next) => {
    try {
      const data = req.body;
      await rules.validateAsync(data, { abortEarly: false });
      next();
    } catch (exception) {
      let msgBag = {};
      console.log(exception);
      exception.details.map((error) => {
        msgBag[error.path.pop()] = error.message;
      });
      next({
        data: msgBag,
        message: "Validation Error",
        status: 400,
      });
    }
  };
};

module.exports = userValidator;
