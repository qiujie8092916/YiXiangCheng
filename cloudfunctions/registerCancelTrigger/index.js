// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = cloud.logger();
const db = cloud.database();

/**
 * @desc 订单过期时间 15 minutes
 * @type {number}
 */
const expired_time = 1000 * 60 * 15;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const _ = db.command;
    const $ = _.aggregate;
    const orderInfoDB = db.collection("order_info");
    const res = await orderInfoDB
      .aggregate()
      .lookup({
        from: "order_snapshot",
        let: {
          order_no: "$order_no",
        },
        pipeline: $.pipeline()
          .match(_.expr($.eq(["$order_id", "$$order_no"])))
          .project({
            order_id: 0,
            create_time: 0,
            update_time: 0,
          })
          .done(),
        as: "snapshotDetail",
      })
      .match({
        order_status: 1,
      })
      .project({
        _id: 1,
        is_send: 1,
        pay_way: 1,
        user_id: 1,
        order_no: 1,
        pay_time: 1,
        use_time: 1,
        pay_price: 1,
        refund_id: 1,
        refund_fee: 1,
        create_time: 1,
        update_time: 1,
        charter_day: 1,
        refund_time: 1,
        total_price: 1,
        commute_way: 1,
        is_subscribe: 1,
        order_status: 1,
        commute_type: 1,
        pay_serial_no: 1,
        charter_duration: 1,
        refundDetail: $.arrayElemAt(["$refundDetail", 0]),
        driverDetail: $.arrayElemAt(["$driverDetail", 0]),
        snapshotDetail: $.arrayElemAt(["$snapshotDetail", 0]),
      })
      .end();

    log.info({
      name: "未支付订单列表",
      result: res,
    });

    (res.list || []).map(async (waitPayOrderItem) => {
      await handlerWaitPayOrderToCancel(waitPayOrderItem);
    });
  } catch (e) {
    log.error({
      func: "registerCancelTrigger",
      abnormal: e,
    });
  }
};

/**
 * @desc 判断待支付订单是否过期，过期则自动取消
 * @param {object} item 订单详情
 */
const handlerWaitPayOrderToCancel = async (item) => {
  console.log(item);
  const now = +new Date();
  if (now - +item.update_time > expired_time) {
    log.info({
      name: "订单过期",
      detail: item,
    });

    await cloud.callFunction({
      name: "orderController",
      data: {
        action: "doCancelOrder",
        params: {
          orderId: item.order_no,
        },
      },
    });
  }
};
