const cartSvs = require("./cart.service");

class cartController {
  createCart = async (req, res, next) => {
    try {
      const data = await cartSvs.createCart(req);
      console.log(data);
      res.json({
        message: "cart is created successfully",
        status: 200,
        data: data,
        option: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

const cartCtrl = new cartController();
module.exports = cartCtrl;
