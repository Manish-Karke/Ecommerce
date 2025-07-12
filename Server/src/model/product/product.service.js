class ProductServices {
  transformCreateProduct = async (req) => {
    try {
      let payload = req.body;
      if (payload.name) {
        payload.slug = slugify(payload.name + "-" + generateRandomString(30), {
          remove: /[*+~.()'"!:@]/g,
          lower: true,
        });
      }

      let price = payload.price * 100;

      if (payload.discount) {
        payload.afterDiscount = price - price * (payload.discount / 100);
      }

      payload.price = price;

      if (
        !payload.categoryId ||
        payload.categoryId === null ||
        payload.categoryId === ""
      ) {
        payload.categoryId = null;
      }

      if (
        !payload.brandId ||
        payload.brandId === null ||
        payload.brandId === ""
      ) {
        payload.brandId = null;
      }

      if (!payload.seller || payload.seller === null || payload.seller === "") {
        payload.seller = req.loggedInUser._id;
      }

      payload.createdBy = req.loggedInUser._id;

      //images
      if (req.files) {
        payload.images = [];
        let beforeUpload = [];

        req.files.map((image) =>
          beforeUpload.push(cloudinarySvs.fileUpload(image.path, "Product/"))
        );
        const uploadImages = await Promise.allSettled(beforeUpload);

        if (uploadImages) {
          uploadImages.map((success) => {
            if (success.status === "fulfilled") {
              payload.images.push(success.value);
            }
          });
        }
      }

      return payload;
    } catch (error) {
      throw error;
    }
  };
  createProduct = async (data) => {
    try {
      const userDetail = new ProductModel(data);
      return await userDetail.save();
    } catch (error) {
      throw error;
    }
  };
}
const productSvs = new ProductServices();
module.exports = productSvs;
