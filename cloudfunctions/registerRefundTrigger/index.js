// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const log = cloud.logger();
const db = cloud.database();

const wxPayComm = {
  sub_mch_id: "1601995626",
  // env_id: "test-ey84k", // cloud.DYNAMIC_CURRENT_ENV,
};

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db
      .collection("order_info")
      .where({
        order_status: 7, // 退款中
      })
      .get();

    res.data.map(async (order) => {
      log.info({
        value: order,
      });
      await queryRefundFromOrder(order.order_no);
    });
  } catch (e) {
    log.error({
      func: "registerRefundTrigger",
      abnormal: e,
    });
  }
};

/**
 * 查询订单退款状态
 * @param {string} order_no
 * @return {Promise<void>}
 */
const queryRefundFromOrder = async (order_no) => {
  const { returnCode, returnMsg, ...rest } = await cloud.cloudPay.queryRefund({
    sub_mch_id: wxPayComm.sub_mch_id,
    nonce_str: payRandomWord(),
    out_trade_no: order_no, // 商户订单号
    // transaction_id: '4200000751202010205662938997', //微信订单号 流水单号
    offset: 0,
  });

  if (returnCode === "FAIL") {
    return log.error({
      value: "queryRefundFromOrder",
      errMsg: returnMsg,
    });
  }

  log.info({
    value: "queryRefundFromOrder",
    ...rest,
    returnMsg,
    returnCode,
  });

  // await updateOrderStatusToRefunded(order_no)
};

/**
 * 更新退款中的订单状态为已退款
 * @param {string} order_no
 * @return {Promise<void>}
 */
const updateOrderStatusToRefunded = async (order_no) => {
  try {
    const orderInfoDb = db.collection("order_info");
    await orderInfoDb
      .where({
        order_no,
      })
      .update({
        data: {
          order_status: 6,
          update_time: db.serverDate(),
        },
      });
    return await Promise.resolve();
  } catch (e) {
    log.error({
      func: "updateOrderStatusToRefunded",
      abnormal: e,
    });
    return await Promise.reject(e);
  }
};

/**
 * @description: 生成支付随机数
 * @return {string}
 */
const payRandomWord = () => {
  let chars, nums, id;
  chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  nums = "";
  for (var i = 0; i < 32; i++) {
    id = parseInt(Math.random() * 61);
    nums += chars[id];
  }
  return nums;
};
