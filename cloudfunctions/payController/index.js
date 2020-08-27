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
  } catch (e) {
    log.info({
      name: "支付后更新数据库失败",
      value: e,
    });
  }
};
