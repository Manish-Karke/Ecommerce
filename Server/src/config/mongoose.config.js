const mongoose = require("mongoose");
const { mongoDbConfig } = require("./const.config");

(async () => {
  try {
    await mongoose.connect(mongoDbConfig.dbUrl, {
      dbName: mongoDbConfig.dbName,
      autoCreate: true,
      autoIndex: true,
    });
    console.log("Db connected successfully!");
  } catch (error) {
    console.error("Db not connected! Error:", error.message);
    process.exit(1);
  }
})();
