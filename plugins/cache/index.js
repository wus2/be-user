var NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = {
  set: (key, value) => {
    return cache.set(key, value);
  },
  get: key => {
    return cache.get(key);
  },
  delete: key => {
    return cache.del(key);
  },
  close: () => {
    cache.close();
  }
};
