/**
 * @description: 2020-10-18 23:20 to 2020年10月17日 23:20
 */
export const dateFormatYyMmDdHh = function (date) {
  let splitTime = date.split("-"),
    splitDay = splitTime[2].split(" "),
    format =
      splitTime[0] +
      "年" +
      splitTime[1] +
      "月" +
      splitDay[0] +
      "日" +
      " " +
      splitDay[1];

  return format;
};

/**
 * @description: 时间戳 to 2020年10月17日 23:20
 */
export const stampFormatYyMmDdHh = function (stamp) {
  let Y = new Date(stamp).getFullYear(),
    M = new Date(stamp).getMonth() + 1,
    D = new Date(stamp).getDate(),
    H = new Date(stamp).getHours(),
    _M =
      new Date(stamp).getMinutes() < 10
        ? "0" + new Date(stamp).getMinutes()
        : new Date(stamp).getMinutes();

  return Y + "年" + M + "月" + D + "日" + " " + H + ":" + _M;
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

/**
 * @description: 切割时间
 * @param {type} '2020-08-24 23:45'
 * @return {type} '2020-8-24 23:45'
 */
export const splitCurrentDate = (date) => {
  let temCurDate = date.split("-"),
    currentDate;
  if (temCurDate[1][0] === "0") {
    currentDate =
      temCurDate[0] +
      "-" +
      temCurDate[1][1] +
      "-" +
      temCurDate[2] +
      " " +
      temCurDate[3];
  } else {
    currentDate = date;
  }

  return currentDate;
};
