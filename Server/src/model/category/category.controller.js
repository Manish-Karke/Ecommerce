const categorySvs = require("./category.service");
const { message } = require("./category.validation");

class categoryContoller {
createCategory = async(req ,res , next)=>{
  try {
    const userDetail = await categorySvs.tranforCreateBrandData(req);

    await categorySvs.createCategory(userDetail)

    res.json({
      message:"new category is created",
      data: userDetail,
      status:200,
      options:null
    })
    if(!userDetail){
      res.json({
        message:"enter the valid details"
      })
    }
  } catch (error) {
    next(error)
  }
}
  
}
const categoryCtrl = new categoryContoller();
module.exports = categoryCtrl;
