require("dotenv").config();

const mongoDbConfig = {
  dbUrl: process.env.MONGO_URL,
  dbName: process.env.DB_NAME,
};

const requirementConfig ={
  port:process.env.PORT
} 

const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

if (
  !cloudinaryConfig.cloudName ||
  !cloudinaryConfig.apiKey ||
  !cloudinaryConfig.apiSecret
) {
  console.warn("warninh:the cloud environment is missed");
}

const appConfig = {
  jwtSecret: process.env.JSONWEBTOKEN,
};
module.exports = {
  mongoDbConfig,
  appConfig,
  cloudinaryConfig,
  requirementConfig
};
