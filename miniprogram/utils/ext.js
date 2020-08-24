const moment = require("../vendor/moment");

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

export const normalDateformat = function (time) {
  return moment(time).format();
};

export const currentDatetime = function () {
  return moment().format("YYYY-MM-DD-HH:mm:ss");
};

export const throttle = function (fn, delay) {
  let timer = null,
    start = Date.now();

  return function () {
    let now = Date.now(),
      cxt = this,
      remaining = delay - (now - start);

    clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(cxt, arguments);
      start = Date.now();
    } else {
      timer = setTimeout(fn, remaining);
    }
  };
};

export const debounce = function (fn, delay) {
  let timer = null;

  return function () {
    let cxt = this,
      args = arguments;

    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(cxt, args);
    }, delay);
  };
};

export const setTimeDateFmt = (s) => {
  // 个位数补齐十位数
  return s < 10 ? "0" + s : s;
};

export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * @description:
 * @param min {Number} 日期后面拼接随机数右区间
 * @param max {Number} 日期后面拼接随机数左区间
 * @return {String} 202008161649491416598
 */
export const randomStingAsUUid = (min = 1, max = 2) => {
  const now = new Date();
  let month = now.getMonth() + 1,
    day = now.getDate(),
    hour = now.getHours(),
    minutes = now.getMinutes(),
    seconds = now.getSeconds();

  month = setTimeDateFmt(month);
  day = setTimeDateFmt(day);
  hour = setTimeDateFmt(hour);
  minutes = setTimeDateFmt(minutes);
  seconds = setTimeDateFmt(seconds);

  let orderCode =
    now.getFullYear().toString() +
    month.toString() +
    day +
    hour +
    minutes +
    seconds +
    Math.round(getRandomArbitrary(min, max) * 1000000).toString();

  return orderCode;
};
