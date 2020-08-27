//app.js
App({
  onLaunch: function () {
    const promiseFinally = require("./utils/promise.finally.polyfill");
    promiseFinally.init();

    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "test-ey84k",
        traceUser: true,
      });
    }

    this.globalData = {};
  },
});
