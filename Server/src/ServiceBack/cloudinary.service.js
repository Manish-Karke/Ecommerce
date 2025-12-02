const { cloudinaryConfig } = require("../config/const.config");
const { deleteFile } = require("../utilities/helper");

const cloudinary = require("cloudinary").v2;

class CloudinaryServices {
  constructor() {
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloud_name,
      api_key: cloudinaryConfig.api_key,
      api_secret: cloudinaryConfig.api_secret,
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
