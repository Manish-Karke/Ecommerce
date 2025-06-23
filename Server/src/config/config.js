const express = require("express");
const cors = require("cors");
const homeRouter = require("./routing.config");
require("./mongoose.config");

const app = express();

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use("/", homeRouter);

app.use((req, res, next) => {
  next({
    message: "pls enter the valid route",
    status: 404,
  });
});

app.use((error, req, res, next) => {
  let data = error.data;
  let message = error.message || "INTERNAL_TIME_OUT";
  let status = error.status || 500;

  console.log(error);

  if (error.name === "MongooseServerError") {
    if (error.code === 11_000) {
      (data = {}), (status = 400);
      message = "validation error";

      Object.keys(error.keyPattern || {}).forEach((items) => {
        data[items] = `${items} should be unique`;
      });
    }
  }

  res.status(status).json({
    data: data,
    message: message,
    status: status,
    Option: null,
  });
});

module.exports = app;
