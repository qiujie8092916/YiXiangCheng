// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = cloud.logger();
const db = cloud.database();

const subscribeMessageId = "PBfi0VyoP-PgUpsNez_tcbHmdit7W_TO609Uzi7dq_4";

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db
      .collection("order_info")
      .where({
        order_status: 3, // 已接单
        is_send: false,
        is_subscribe: true,
      })
      .get();

    log.info({
      value: "准备下发",
    });

    res.data.map(async (order) => {
      log.info({
        value: order,
      });
      await sendSubscribeMessage(order);
    });
  } catch (e) {
    log.error({
      value: e,
    });
  }
};

/**
 * @description: 接单下发消息
 * @param {type}
 * @return {type}
 */
async function sendSubscribeMessage({ order_no, user_id }) {
  const { resultData } = await cloud.callFunction({
      name: "orderController",
      data: {
        action: "checkOrderDetail",
        params: {
          orderId: order_no,
        },
      },
    }),
    { driverDetail, pay_price, use_time } = resultData,
    result = await cloud.openapi.subscribeMessage.send({
      data: {
        name1: {
          value: driverDetail.user_name,
        },
        car_number2: {
          value: driverDetail.car_number,
        },
        phone_number3: {
          value: driverDetail.user_phone,
        },
        amount5: {
          value: pay_price,
        },
        time8: {
          value: use_time,
        },
      },
      lang: "zh_CN",
      touser: user_id,
      page: "pages/home/home",
      miniprogramState: "developer", // developer为开发版；trial为体验版；formal为正式版；默认为正式版
      templateId: subscribeMessageId,
    });
  if (result.errCode === 0) {
    log.info({
      value: "已经接单，消息下发",
    });

    db.collection("order_info")
      .where({
        order_no: order_no,
      })
      .update({
        data: {
          is_send: true,
        },
      });
  } else {
    log.error({
      value: result.errMsg,
    });
  }
}
