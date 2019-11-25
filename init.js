var toml = require('toml');
var fs = require('fs');

var config;

export const getCfg = () => {
  return config;
};

export default init = () => {
  config = toml.parse(fs.readFileSync('./config.dev.toml', 'utf-8'));
};
