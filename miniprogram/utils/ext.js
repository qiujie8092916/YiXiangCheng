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
    case "Hm":
      return moment(date).format("HH:mm");
      break;
    default:
      return moment(date);
  }
};

export const nextMonth = function () {
  return moment().add(1, "month").format();
};

export const isSameDay = function (date) {
  return moment().isSame(date, "day");
};

export const isBefore = function (date) {
  return moment(date).isBefore();
};

export const isAfter = function (date) {
  return moment(date).isAfter();
};

export const joinTime = function (time) {
  return moment().format("YYYY-MM-DD") + " " + time;
};
