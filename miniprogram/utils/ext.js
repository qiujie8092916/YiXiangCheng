const moment = require("./moment");

moment.locale("zh-cn", {
  longDateFormat: {
    L: "MMM Do",
    LT: "YYYY-MM-DD",
  },
});

export const dateFormat = function (date = new Date(), type) {
  switch (type) {
    case "MD":
      return moment(date).format("L");
      break;
    case "YMD":
      return moment(date).format("LT");
      break;
    default:
      return moment(date);
  }
};
