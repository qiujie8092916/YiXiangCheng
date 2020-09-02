// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = cloud.logger();
const db = cloud.database();

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

    res.data.map(async (order) => {
      const result = await cloud.openapi.subscribeMessage.send({
        data: {
          name1: {
            value: "李师傅",
          },
          car_number2: {
            value: "沪A123456",
          },
          phone_number3: {
            value: "18356032765",
          },
          amount5: {
            value: "200元",
          },
          time8: {
            value: "2020-09-02 08:00",
          },
        },
        lang: "zh_CN",
        touser: order.user_id,
        page: "pages/home/home",
        miniprogramState: "developer", // developer为开发版；trial为体验版；formal为正式版；默认为正式版
        templateId: "PBfi0VyoP-PgUpsNez_tcbHmdit7W_TO609Uzi7dq_4",
      });
      if (result.errCode === 0) {
        log.info({
          value: "审核通过，消息下发",
        });

        db.collection("order_info")
          .where({
            order_no: order.order_no,
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
    });
  } catch (e) {
    log.error({
      value: e,
    });
  }
};
