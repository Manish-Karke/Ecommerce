const http = require("http");

const app = require("./config/config");

const PORT = "8000";
const URL = "127.0.0.1";
const httpServer = http.createServer(app);

httpServer.listen(PORT, URL, (error) => {
  if (!error) {
    console.log(`http://${URL}:${PORT}`);
  }
});
