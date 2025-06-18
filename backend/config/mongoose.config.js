const mongoose = require("mongoose");
const { mongoDbConfig } = require("./config.config");

(async () => {
  try {
    await mongoose.connect(mongoDbConfig.dbUrl, {
      dbName: mongoDbConfig.dbName,
      autoCreate: true,
      autoIndex: true,
    });
    console.log("Db connected succesfully!");
  } catch (error) {
    console.log("Db not connected!");
    process.exit(1);
  }
})();
