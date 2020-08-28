/**
 * @description polyfill
 * @exports class
 * @Author jieq
 * @Date 2020-05-14 17:28:38
 * @LastEditors jieq
 * @LastEditTime 2020-05-14 17:29:51
 */

module.exports = {
  init() {
    if (Promise && !Promise.prototype.finally) {
      Promise.prototype.finally = function (callback) {
        var Promise = this.constructor;
        return this.then(
          function (value) {
            Promise.resolve(callback()).then(function () {
              return value;
            });
          },
          function (reason) {
            Promise.resolve(callback()).then(function () {
              throw reason;
            });
          }
        );
      };
    }
  },
};
