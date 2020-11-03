/**
 * @desc 【包车】用车时间可选区间
 * @default 2h~90d
 */
export const CHARTER_USER_TIME_DURATION = [
  2 * 60 * 60 * 1000,
  90 * 24 * 60 * 60 * 1000,
];

/**
 * @desc 【通勤】用车时间可选区间
 * @default 2h~90d
 */
export const COMMUTE_USER_TIME_DURATION = [
  2 * 60 * 60 * 1000,
  90 * 24 * 60 * 60 * 1000,
];

/**
 * @desc 【包车】全损时间节点
 * @default 4h
 */
export const CHARTER_LOSS = 4 * 60 * 60 * 1000;

/**
 * @desc 【通勤】全损时间节点
 * @default 4h
 */
export const COMMUTE_LOSS = 4 * 60 * 60 * 1000;

/**
 * @desc 【包车】下单前全损提示延迟时间
 * @default 2h
 */
export const CHARTER_LOSS_DELAY = 2 * 60 * 60 * 1000;

/**
 * @desc 【通勤】下单前全损提示延迟时间
 * @default 2h
 */
export const COMMUTE_LOSS_DELAY = 2 * 60 * 60 * 1000;

/**
 * 腾讯poi选点配置
 */
export const poiConfig = {
  key: "DSEBZ-F4PLU-VCSVS-4XIYK-JRFMQ-UKF6T",
  referer: "享易程-打车",
};

/**
 * 腾讯线路规划配置
 */
export const routeConfig = {
  key: "KTGBZ-5OBRK-ATTJX-AWI37-F4HZQ-VEFEL",
};

/**
 * 业务类型
 * @enum
 */
export const bussinessType = {
  charter: 1,
  commute: 2,
};

/**
 * 消息订阅模板id
 * @typedef SubMsgs
 * @property {string} SubMsgs.orderStatusId - 订单状态
 * @property {string} SubMsgs.registerId - 注册

 * @type {object} SubMsgs
 */
export const subscribeMessageIds = {
  orderStatusId: "PBfi0VyoP-PgUpsNez_tcbHmdit7W_TO609Uzi7dq_4",
  registerId: "tmuTKASNdq3h637YPkUSp9t57ePCCougAKaSzbEJvKo",
};

/**
 * 包车可选天数
 * @type {number[]}
 */
export const charterDays = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
];

/**
 * @desc 订单状态映射
 * @enum
 */
export const orderStatusMap = {
  WAITPAY: {
    key: 1,
    value: "待支付",
  },
  WAITRECEIVING: {
    key: 2,
    value: "待接单",
  },
  RECEIVED: {
    key: 3,
    value: "已接单",
  },
  BILLING: {
    key: 4,
    value: "已上车",
  },
  CANCELED: {
    key: 5,
    value: "已取消",
  },
  REFUNDED: {
    key: 6,
    value: "已退款",
  },
  REFUNDING: {
    key: 7,
    value: "退款中",
  },
  ACHIEVE: {
    key: 10,
    value: "已完成",
  },
};
