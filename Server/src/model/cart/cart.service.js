const CartModel = require("./cart.model");

class CartServices {
  createCart = async (data) => {
    try {
      const cart = new CartModel(data);
      return await cart.save();
    } catch (error) {
      throw error;
    }
  };

  updateCart = async (data, updateData) => {
    try {
      const updateData = await CartModel.findByIdAndUpdate(
        data,
        {
          $set: updateData,
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  };

  deleteCart = async (data) => {
    try {
      const delCart = await CartModel.findByIdAndDelete(data);
      return delCart;
    } catch (error) {
      throw error;
    }
  };
}

const cartSvs = new CartServices();
module.exports = cartSvs;
