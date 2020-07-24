const moment = require("./moment");

moment.locale("zh-cn");

export const dateFormat = function (date = new Date(), type) {
  switch (type) {
    case "MD":
      return moment(date).format("MMM Do");
      break;
    case "YMD":
      return moment(date).format("YYYY-MM-DD");
      break;
    case "HM":
      return moment(date).format("HH:MM");
      break;
    default:
      return moment(date);
  }
};

export const nextMonth = function () {
  return moment().add(1, "month").format();
};
