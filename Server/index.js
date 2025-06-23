const http = require("http");

const app = require("./src/config/config");
const { requirementConfig } = require("./src/config/config.config");

const PORT = requirementConfig.port;
const URL = "127.0.0.1";
const httpServer = http.createServer(app);

httpServer.listen(PORT, URL, (error) => {
  if (!error) {
    console.log(`http://${URL}:${PORT}`);
  }
});
