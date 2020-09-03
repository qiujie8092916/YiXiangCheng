import { subscribeMessageIds } from "../config";

/**
 * @desc 订单类
 * @export Order
 */
export default class Order {
  /**
   * @desc 订阅订单状态消息
   * @static
   * @returns {Promise<boolean>}
   */
  static subscribeOrderStatus() {
    return new Promise((resolve) => {
      wx.requestSubscribeMessage({
        tmplIds: [subscribeMessageIds.orderStatusId],
        success(res) {
          if (res[subscribeMessageIds.orderStatusId] === "accept") {
            console.log(res, "用户订阅");
            resolve(true);
          } else {
            console.log(res, "用户不订阅");
            resolve(false);
          }
        },
        fail(err) {
          console.log(err, "订阅接口失败");
          resolve(false);
        },
      });
    });
  }

  /**
   * @desc 创单
   * @static
   * @param {object} params 创单参数
   */
  static createOrder(params) {
    return new Promise((resolve, reject) => {
      wx.showLoading({ title: "加载中" });
      wx.cloud
        .callFunction({
          name: "orderController",
          data: {
            action: "createPerpayRequest",
            params,
          },
        })
        .then(({ result = {} }) => {
          if (+result.resultCode !== 0) {
            throw "下单失败";
          }

          wx.hideLoading();
          resolve(result.resultData);
        })
        .catch((err) => {
          wx.hideLoading();
          wx.showToast({
            title: "请稍后重试",
            icon: "none",
          });
          console.error(err, "预支付error");
          reject();
        });
    });
  }

  /**
   * @desc 支付
   * @param {string} orderNo 订单号
   * @param {object} payment 支付所需参数
   * @returns {Promise}
   */
  static invokePay(orderNo, payment) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...payment,
        success(res) {
          console.log("pay_success", res);
          resolve();
        },
        fail(err) {
          console.error("pay_fail", err);
          reject(err);
        },
      });
    });
  }

  /**
   * @desc 查询订单
   * @param {string} orderNo 订单号
   * @static
   * @returns {object}
   */
  static queryOrder(orderNo) {}
}
