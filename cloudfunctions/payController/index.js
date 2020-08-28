/*
 * @Description: 统一下单回调
 * @Author: longzhang6
 * @Date: 2020-08-28 22:09:22
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-08-29 00:27:55
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
          pay_serial_no: event.transactionId,
        },
      });

    // todo 多次调用
    await cloud.callFunction({
      name: "sendMailController",
      data: {
        action: "sendPickUpOrderEmail",
        params: {},
      },
    });
  } catch (e) {
    log.info({
      name: "支付后更新数据库失败",
      value: e,
    });
  }
};
