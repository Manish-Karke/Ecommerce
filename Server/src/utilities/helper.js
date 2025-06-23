const fs = require("fs");

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  } else {
    return false;
  }
};

const generateRandomString = (len) => {
  const str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let randonString = "";
  stringlength = str.length;

  for (let i = 0; i < len; i++) {
    const pos = Math.floor(Math.random() * stringlength);
    randonString += str[pos];
  }
  return randonString;
};

module.exports = {
  deleteFile,
  generateRandomString,
};
