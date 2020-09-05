/*
 * @Description: 统一下单回调
 * @Author: longzhang6
 * @Date: 2020-08-28 22:09:22
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-09-02 23:48:21
 */
// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = cloud.logger();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
  log.info(event);

  const orderInfoDb = db.collection("order_info");

  try {
    await orderInfoDb
      .where({
        order_no: event.outTradeNo,
      })
      .update({
        data: {
          pay_time: event.timeEnd.toString(),
          pay_price: event.totalFee,
          order_status: 2,
          pay_serial_no: event.transactionId,
        },
      });

    sendEmail(event).catch();

    return {
      errcode: 0,
      errmsg: "支付回调成功",
    };
  } catch (e) {
    log.error({
      name: "支付后回调失败",
      value: e,
    });
    return {
      errcode: -1,
      errmsg: "支付回调失败",
    };
  }
};

const sendEmail = (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      //查询订单详情 给到邮件内容
      const { result = {} } = await cloud.callFunction({
        name: "orderController",
        data: {
          action: "checkOrderDetail",
          params: {
            orderId: event.outTradeNo,
          },
        },
      });

      const orderInfo = result.resultData;

      log.info({
        name: "支付后查询订单详情",
        value: orderInfo,
      });

      cloud.callFunction({
        name: "sendMailController",
        data: {
          action: "sendPickUpOrderEmail",
          params: orderInfo,
        },
      });
      resolve();
    } catch (e) {
      log.error({
        name: "sendEmail",
        value: e,
      });
      reject(e);
    }
  });
};
