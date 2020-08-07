const helper = {
  get Respose() {
    const module = require("./Response");
    return module && module.__esModule ? module.default : module;
  },
};

module.exports = helper;
