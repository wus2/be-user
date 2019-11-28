var toml = require("toml");
var fs = require("fs");

var config;

module.exports = {
  initConfig: () => {
    config = toml.parse(fs.readFileSync("./config.dev.toml", "utf-8"));
  },
  getPort: () => {
    return config.https.port;
  },
  getConfigDb: () => {
    return config.mysql;
  },
  getKeyJWT: () => {
    return config.services.key_jwt;
  }
};
