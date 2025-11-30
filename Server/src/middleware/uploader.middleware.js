const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = "./public/uploads";

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },

  filename(req, file, cb) {
    let fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const uploader = (type = "image") => {
  let fileExts = ["jpg", "jpeg", "png", "svg", "gif", "webp"];
  let limit = 3e6;

  if (type === "document") {
    fileExts = ["doc", "docs", "pdf", "xlms", "xlm"];
    limit = 5e6;
  }

  const fileFilter = (req, file, cb) => {
    let fileExt = file.originalname.split(".").pop();

    if (fileExts.includes(fileExt.toLowerCase())) {
      cb(null, true);
    } else {
      cb({
        status: 422,
        message: "File format not supported!.",
      });
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: limit,
    },
  });
};

module.exports = uploader;
