// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = cloud.logger();
const db = cloud.database();

/**
 * @desc 自动完单时间 24 hours
 * @type {number}
 */
const auto_achieve_time = 1000 * 60 * 60 * 24;

// 云函数入口函数
exports.main = async () => {
  try {
    const _ = db.command;
    // const $ = _.aggregate;
    const orderInfoDB = db.collection("order_info");
    const res = await orderInfoDB
      .where({
        // 3（已接单） / 4（已上车）
        order_status: _.in([3, 4]),
      })
      .get();

    log.info({
      name: "未完成订单列表",
      result: res,
    });

    (res.data || []).map(async (unfinishedOrderItem) => {
      await handlerUnfinishedOrderToAchieve(unfinishedOrderItem);
    });
  } catch (e) {
    log.error({
      func: "registerAchieveTrigger",
      abnormal: e,
    });
  }
};

/**
 * @desc 判断未完成订单是否过期，过期则自动完单
 * @param {object} item 订单详情
 */
const handlerUnfinishedOrderToAchieve = async (item) => {
  const now = +new Date();
  // 用车时间没记时间偏移量，所以此处要手动减去东8区的偏移量
  if (
    now - (+new Date(item.use_time) - 1000 * 60 * 60 * 8) >
    auto_achieve_time
  ) {
    log.info({
      name: "完单超时",
      detail: item,
    });

    await db
      .collection("order_info")
      .where({
        order_no: item.order_no,
      })
      .update({
        data: {
          order_status: 10,
          update_time: db.serverDate(),
        },
      })
      .then(async (res) => {
        await cloud.callFunction({
          name: "sendMailController",
          data: {
            action: "sendAutoAchieveOrderEmail",
            params: {
              orderInfo: item,
            },
          },
        });
      });
    return Promise.resolve();
  }
  return Promise.resolve();
};
