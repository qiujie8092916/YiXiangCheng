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
  let mailInfo = {};

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

    log.info({
      name: "支付后查询订单详情订单号",
      value: event.outTradeNo,
    });

    const res = await cloud.callFunction({
      name: "orderController",
      data: {
        action: "checkOrderDetail",
        params: {
          orderId: event.outTradeNo,
        },
      },
    });

    log.info({
      name: "支付后查询订单详情",
      value: res.result.resultData,
    });
    if (res && res.result && res.result.resultData) {
      mailInfo = res.result.resultData;
    } else {
      throw "订单详情查询失败";
    }

    await cloud.callFunction({
      name: "sendMailController",
      data: {
        action: "sendPickUpOrderEmail",
        params: mailInfo,
      },
    });

    return {
      errcode: 0,
      errmsg: "支付回调成功",
    };
  } catch (e) {
    log.info({
      name: "支付后更新数据库失败",
      value: e,
    });
    return {
      errcode: -1,
      errmsg: "支付回调失败",
    };
  }
};
