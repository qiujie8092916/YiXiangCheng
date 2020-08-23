// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();

// 云开发支付 https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/open/pay/CloudPay.unifiedOrder.html

// 云函数入口函数
/**
 * @desc 订单
 * @param {RequestAction} event
 * @typedef RequestAction
 * @property {1|2} RequestAction.bizType 1-包车 2-通勤
 * @returns {Promise<>}
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  genOrderNumber(event.bizType);

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };

  switch (event.action) {
    case "createTemporaryOrder": {
      return createTemporaryOrder(event);
    }
    default: {
      return;
    }
  }
};

/**
 * @desc 生成订单号
 * @rule 一位产线类型（1：包车；2：通勤）+ 时间戳的九位（舍去第一位和后三位）+ 两位随机数 + userId的最后两位
 * @param {1|2} bizType 1-包车 2-通勤
 * @returns {string} 14位
 */
const genOrderNumber = (bizType) => {
  const timestamp = +new Date();
  const random = getRandomArbitrary();
  const { OPENID } = cloud.getWXContext();
  const orderNumber = `${bizType}${timestamp
    .toString()
    .slice(1, -3)}${random}${OPENID.slice(-2)}`;

  console.log("timestamp", timestamp.toString());
  console.log("random", random);
  console.log("OPENID", OPENID);
  console.log("orderNumber", orderNumber, typeof orderNumber);

  return orderNumber;
};

/**
 * @ 个位数补齐十位数
 * @param {number} s
 * @returns {string}
 */
const setTimeDateFmt = (s) => {
  return s < 10 ? "0" + s : "" + s;
};

/**
 * @desc 生成两位随机数
 * @returns {string}
 */
const getRandomArbitrary = () => {
  return setTimeDateFmt(Math.floor(Math.random() * 100)).toString();
};

/**
 * @description: 创建临时单
 * @param {String} departure 上车地点
 * @param {String} destination 下车地点
 * @param {Number} bizType 下单类型 1 包车 2 通勤
 * @param {Date} departure_time 乘车时间
 * @param {String} contact_name 乘车联系人姓名
 * @param {String} phone 联系人手机号
 * @param {String} commute_type 通勤类型 独享 拼车
 * @param {Number} status 订单状态 待支付...
 */
const createTemporaryOrder = (request) => {};
