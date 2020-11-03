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
  log.info({
    name: "回调payController",
    event,
  });

  try {
    if (event.resultCode === "SUCCESS" && event.returnCode === "SUCCESS") {
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

      if (orderInfo.order_status === 1) {
        log.info({
          name: "订单状态【未支付】，准备更新订单状态",
          event,
          orderInfo,
        });

        const orderInfoDb = db.collection("order_info");
        const upd = {
          pay_time: event.timeEnd.toString(),
          pay_price: event.totalFee,
          order_status: 2,
          pay_serial_no: event.transactionId,
        };
        orderInfoDb
          .where({
            order_no: event.outTradeNo,
          })
          .update({
            data: upd,
          })
          .then(async () => {
            log.info({
              name: "订单状态更新成功，准备发送邮件",
              params: orderInfo,
            });

            sendEmail({ ...orderInfo, ...upd });

            log.info({
              name: "发送邮件后，返回payController【SUCCESS】",
            });

            return { errcode: 0, errmsg: "" };
          });
      } else {
        log.info({
          name: "非未支付订单，滤掉",
          value: orderInfo,
        });
        return { errcode: 0, errmsg: "" };
      }
    } else {
      log.error({
        name: "payController:支付回调失败",
        value: event,
      });
      return { errcode: -1, errmsg: "支付回调失败" };
    }
  } catch (e) {
    log.error({
      func: "payController",
      abnormal: e,
    });
    return {
      errcode: -1,
      errmsg: "FAIL",
    };
  }
};

const sendEmail = (orderInfo) => {
  cloud.callFunction({
    name: "sendMailController",
    data: {
      action: "sendPickUpOrderEmail",
      params: orderInfo,
    },
  });
};
