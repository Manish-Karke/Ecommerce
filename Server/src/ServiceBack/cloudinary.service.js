const { cloudinaryConfig } = require("../config/config.config");
const { deleteFile } = require("../utilities/helper");

const cloudinary = require("cloudinary").v2;

class CloudinaryServices {
  constructor() {
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
    });
  }

  fileUpload = async (path, dir = "") => {
    try {
      const { public_id, secure_url } = await cloudinary.uploader.upload(path, {
        folder: "ecommerce/" + dir,
        unique_filename: true,
      });

      const optimizedUrl = cloudinary.image(path, {
        transformation: [
          { gravity: "face", height: 200, width: 200, crop: "thumb" },
          { radius: "max" },
          { fetch_format: "auto" },
        ],
      });

      deleteFile(path);

      return {
        public_id: public_id,
        url: secure_url,
        OptimizedUrl: optimizedUrl,
      };
    } catch (exception) {
      throw exception;
    }
  };
}

const cloudinarySvs = new CloudinaryServices();

module.exports = cloudinarySvs;
