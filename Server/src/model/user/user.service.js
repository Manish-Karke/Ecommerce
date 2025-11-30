const userModel = require("./user.database");

class UserServices {
  createUser = async (data) => {
    try {
      const userObject = new userModel(data);
      return await userObject.save();
    } catch (error) {
      throw error;
    }
  };

  getTokenByFilter = async (data) => {
    const token = await userModel.findOne(data);
    return token;
  };

  updateUserByFilter = async (filter, data) => {
    const updatedUser = await userModel.findOneAndUpdate(data, filter);
    return updatedUser;
  };

  getUserProfile = (userObj) => {
    return {
      username: userObj.username,
      email: userObj.email,
      password: userObj.password,
      gender: userObj.gender,
      status: userObj.status,
      dob: userObj.dob,
      activationToken: userObj.activationToken,
      image: userObj.image,
      _id: userObj._id,
    };
  };
}

const userSvc = new UserServices();

module.exports = userSvc;
