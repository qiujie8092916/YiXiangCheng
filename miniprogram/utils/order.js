import {
  CHARTER_LOSS,
  COMMUTE_LOSS,
  bussinessType,
  CHARTER_LOSS_DELAY,
  COMMUTE_LOSS_DELAY,
  subscribeMessageIds,
  CHARTER_USER_TIME_DURATION,
  COMMUTE_USER_TIME_DURATION,
} from "../config";

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

  /**
   * @desc 用车时间区间校验
   * @param {number} biz_type - 订单类型
   * @param {string} use_time - 用车时间
   * @static
   * @returns {boolean}
   */
  static checkUserTime(biz_type, use_time) {
    const now = new Date().valueOf();
    const use_time_stamp = new Date(use_time.replace(/-/g, "/")).valueOf();

    if (biz_type === bussinessType.charter) {
      if (
        use_time_stamp - now >= CHARTER_USER_TIME_DURATION[0] &&
        use_time_stamp - now <= CHARTER_USER_TIME_DURATION[1]
      ) {
        return true;
      }
    } else if (biz_type === bussinessType.commute) {
      if (
        use_time_stamp - now >= COMMUTE_USER_TIME_DURATION[0] &&
        use_time_stamp - now <= COMMUTE_USER_TIME_DURATION[1]
      ) {
        return true;
      }
    }
    return false;
  }

  static alertLoss(loss_time, is_history) {
    return new Promise((resolve) => {
      wx.showModal({
        title: "",
        content: is_history
          ? `您的订单临近用车时间，一经预订不可免费取消，请确认是否继续预订`
          : `您的订单临近用车时间，${loss_time}后不可免费取消，请确认是否继续预订`,
        confirmText: "继续预订",
        cancelText: "暂不预订",
        success: (res) => {
          if (res.confirm) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        },
      });
    });
  }

  /**
   * 下单前全损校验，并强提示
   * @param {object} options
   * @param {number} options.biz_type - 订单类型
   * @param {string} options.use_time - 用车时间 '2020-10-14 14:30'
   * @param {boolean} options.is_loss_time_history - 全损时间是否是历史时间
   * @param {string} options.loss_time - 全损时间 '2020年10月14日 18:30'
   *
   *    用车时间 - 当前时间 < 全损时间节点 + 2h
   */
  static async checkLossToAlert({
    biz_type,
    use_time,
    loss_time,
    is_loss_time_history,
  }) {
    const now = new Date().valueOf();
    const use_time_stamp = new Date(use_time.replace(/-/g, "/")).valueOf();

    if (biz_type === bussinessType.charter) {
      if (use_time_stamp - now < CHARTER_LOSS + CHARTER_LOSS_DELAY) {
        return Promise.resolve(
          await Order.alertLoss(loss_time, is_loss_time_history)
        );
      }
    } else if (biz_type === bussinessType.commute) {
      if (use_time_stamp - now < COMMUTE_LOSS + COMMUTE_LOSS_DELAY) {
        return Promise.resolve(
          await Order.alertLoss(loss_time, is_loss_time_history)
        );
      }
    }
    return Promise.resolve(true);
  }
}
