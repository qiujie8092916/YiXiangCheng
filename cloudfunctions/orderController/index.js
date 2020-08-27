// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const bussinessType = {
  charter: 1,
  commute: 2,
};

// 云函数入口函数
/**
 * @desc 订单
 * @param {RequestAction} event
 * @typedef RequestAction
 * @property {1|2} RequestAction.bizType 1-包车 2-通勤
 * @returns {Promise<>}
 */
exports.main = async (event, context) => {
  switch (event.action) {
    case "createPerpayRequest": {
      return createPerpayRequest(event.params);
    }
    case "checkOrderDetail": {
      return checkOrderDetail(event.params);
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
 * @description: 生成支付随机数
 * @param {type}
 * @return {type}
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

/**
 * @description: 预支付
 * @param {object} request
 * @param {1|2} request.bizType 业务类型 1-包车 2-通勤
 * @param {number} request.money 整数 单位：分
 * @param {string} request.contact_name 联系人姓名
 * @param {string} request.phone 联系人电话
 * @param {object|string} request.departure 出发地点信息（包车是poi返回的object, 通勤是维护的地址id）
 * @param {string} request.departure_time 出发时间
 * @param {object|string} request.destination 到达地点信息（同departure）
 */
const createPerpayRequest = async (request) => {
  let _nonceStr = payRandomWord(),
    _outTradeNo = genOrderNumber(request.bizType),
    createOrderParams, // 下单参数
    snapshotId, // 订单快照id
    snapshotInfo, //  订单快照返回信息
    createOrderInfo, // 创建订单信息
    prePayResult = {},
    orderDesc =
      request.bizType === bussinessType.charter
        ? "小享兽-包车"
        : "小享兽-通勤接送";
  try {
    const res = await cloud.cloudPay.unifiedOrder({
      functionName: "pay_cb",
      envId: "test-ey84k",
      subMchId: "1601995626",
      nonceStr: _nonceStr,
      body: orderDesc,
      outTradeNo: _outTradeNo,
      spbillCreateIp: "127.0.0.1",
      totalFee: request.money,
      tradeType: "JSAPI",
    });

    prePayResult = Object.assign({}, res, { outTradeNo: _outTradeNo });

    createOrderParams = Object.assign({}, request, {
      outTradeNo: _outTradeNo,
    });

    snapshotInfo = await updateOrderSnapshot(createOrderParams);
    snapshotId = snapshotInfo.resultData ? snapshotInfo.resultData._id : "";

    createOrderParams = Object.assign({}, request, {
      outTradeNo: _outTradeNo,
      snapshot_id: snapshotId,
    });

    createOrderInfo = await createWaitPayOrder(createOrderParams);

    return {
      resultCode: 0,
      resultData: prePayResult,
    };
  } catch (e) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e,
    };
  }
};

/**
 * @description: 待支付订单
 * @param {object} request
 * @param {String} request.outTradeNo 订单id
 * @param {String} request.departure_time 用车时间
 * @param {String} request.charter_duration 包车时长
 * @param {Number} request.order_status 订单状态
 * @param {String} request.pay_serial_no 支付流水
 * @param {String} request.pay_time 支付时间
 * @param {0|1|2} request.pay_way 支付方式 0-微信 1-支付宝 2-银联
 * @param {Number} request.pay_price 支付金额
 * @param {String} request.refund_fee 退款金额
 * @param {String} request.refund_time 退款时间
 * @param {String} request.user_id 车车人id
 * @param {String} request.driver_id 司机id
 * @param {String} request.snapshot_id snapid
 * @param {String} request.is_subscribe 是否订阅发送接单消息
 * @param {String} request.create_time 创建时间
 * @param {String} request.update_time 更新时间
 */
const createWaitPayOrder = async (request) => {
  const { OPENID } = cloud.getWXContext();
  const orderDb = db.collection("order_info");
  try {
    return await orderDb
      .add({
        data: {
          order_no: request.outTradeNo,
          use_time: request.departure_time,
          order_status: 1,
          charter_duration: request.charter_duration,
          pay_serial_no: null,
          pay_time: null,
          pay_way: 0,
          pay_price: 0,
          refund_fee: 0,
          refund_time: db.serverDate(),
          user_id: OPENID,
          driver_id: null,
          snapshot_id: request.snapshot_id,
          is_subscribe: request.is_subscribe,
          is_send: false,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
        },
      })
      .then((res) => {
        return {
          resultCode: 0,
          resultData: res,
        };
      })
      .catch((err) => {
        return {
          resultCode: -1,
          resultData: null,
          errMsg: err,
        };
      });
  } catch (e) {
    console.log(e);
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e,
    };
  }
};

/**
 * @description: 下单更新地址快照表order_snapshot
 * @param {type}
 * @return {type}
 */
const updateOrderSnapshot = async (request) => {
  const snapshotDb = db.collection("order_snapshot");

  let pick_info = request.departure,
    drop_info = {};
  if (request.bizType === bussinessType.commute) {
    if (
      Object.prototype.toString.call(request.departure) === "[object String]"
    ) {
      pick_info = await getAddressInfo(request.departure);
    }
    if (
      Object.prototype.toString.call(request.destination) === "[object String]"
    ) {
      drop_info = await getAddressInfo(request.destination);
    }
  }

  try {
    return await snapshotDb
      .add({
        data: {
          pick_info,
          drop_info,
          biz_type: request.bizType,
          contact_name: request.contact_name,
          contact_phone: request.phone,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
        },
      })
      .then((res) => {
        return {
          resultCode: 0,
          resultData: res,
        };
      })
      .catch((err) => {
        return {
          resultCode: -1,
          resultData: null,
          errMsg: err,
        };
      });
  } catch (error) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: err,
    };
  }
};

/**
 * @desc 获取地址信息
 * @param id
 * @retrun {object}
 */
const getAddressInfo = async (id) => {
  try {
    await cloud.callFunction({
      // 要调用的云函数名称
      name: "addressController",
      // 传递给云函数的event参数
      data: {
        action: "getAddressById",
        id,
      },
    });
  } catch (e) {
    return {};
  }
};

/**
 * @description: 查询订单详情
 * @param {String} orderId 订单Id
 * @return {Object} 订单详情
 */
const checkOrderDetail = async (request) => {
  const orderInfoDb = db.collection("order_info");
  try {
    const result = await orderInfoDb
      .where({
        order_id: request.orderId,
      })
      .get();

    return {
      resultCode: 0,
      resultData: result.data[0] ? result.data[0] : null,
    };
  } catch (e) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e,
    };
  }
};
