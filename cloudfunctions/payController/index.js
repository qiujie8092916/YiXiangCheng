/*
 * @Description: 统一下单回调
 * @Author: longzhang6
 * @Date: 2020-08-28 22:09:22
 * @LastEditors: longzhang6
 * @LastEditTime: 2020-09-02 20:25:26
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

    await cloud.callFunction({
      name: "sendMailController",
      data: {
        action: "sendPickUpOrderEmail",
        params: {},
      },
    });

    return {
      errcode: 0,
      errmsg: null,
    };
  } catch (e) {
    log.info({
      name: "支付后更新数据库失败",
      value: e,
    });
    return {
      errcode: -1,
      errmsg: "支付后更新数据库失败",
    };
  }
};
