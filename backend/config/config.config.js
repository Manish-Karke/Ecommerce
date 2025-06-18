require("dotenv").config();

const mongoDbConfig = {
   dbUrl: process.env.MONGO_URL,
  dbName: process.env.DB_NAME,
}

module.exports ={
  mongoDbConfig
}