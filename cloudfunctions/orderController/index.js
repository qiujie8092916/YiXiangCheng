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
 * @param {number} request.total_price 整数 单位：分
 * @brief 剩下参数见 createWaitPayOrder
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
      functionName: "payController",
      envId: "test-ey84k",
      subMchId: "1601995626",
      nonceStr: _nonceStr,
      body: orderDesc,
      outTradeNo: _outTradeNo,
      spbillCreateIp: "127.0.0.1",
      totalFee: request.total_price,
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

    console.log(createOrderInfo, "下单信息");

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
 * @param {String} request.bizType 用车类型
 * @param {String} request.charter_duration 包车时长（包车特殊字段）
 * @param {String} request.commute_way 通勤方式 0-拼车 1-独享（通勤特殊字段）
 * @param {String} request.commute_type 通勤时长 0-回家 1-上班（通勤特殊字段）
 * @param {Number} request.order_status 订单状态
 * @param {String} request.pay_serial_no 支付流水
 * @param {String} request.pay_time 支付时间
 * @param {0|1|2} request.pay_way 支付方式 0-微信 1-支付宝 2-银联
 * @param {Number} request.pay_price 支付金额
 * @param {Number} request.total_price 订单金额
 * @param {String} request.refund_fee 退款金额
 * @param {String} request.refund_time 退款时间
 * @param {String} request.user_id 车车人id
 * @param {String} request.driver_id 司机id
 * @param {String} request.snapshot_id snapid
 * @param {String} request.is_subscribe 是否订阅发送接单消息
 * @param {String} request.create_time 创建时间
 * @param {String} request.update_time 更新时间
 * @brief 剩下参数见 updateOrderSnapshot
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
          pay_serial_no: null,
          pay_time: null,
          pay_way: 0,
          pay_price: 0,
          total_price: request.total_price,
          refund_fee: 0,
          refund_time: null,
          user_id: OPENID,
          driver_id: null,
          snapshot_id: request.snapshot_id,
          is_subscribe: request.is_subscribe,
          is_send: false,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
          charter_duration:
            request.bizType === bussinessType.charter
              ? request.charter_duration
              : null, //包车特殊字段
          commute_way:
            request.bizType === bussinessType.commute
              ? request.commute_way
              : null, //通勤特殊字段
          commute_type:
            request.bizType === bussinessType.commute
              ? request.commute_type
              : null, //通勤特殊字段
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
 * @param {object} request
 * @param {1|2} request.bizType 业务类型 1-包车 2-通勤
 * @param {string} request.contact_name 联系人姓名
 * @param {string} request.phone 联系人电话
 * @param {object|string} request.departure 出发地点信息（包车是poi返回的object, 通勤是维护的地址id）
 * @param {object|string} request.destination 到达地点信息（同departure）
 * @return {type}
 */
const updateOrderSnapshot = async (request) => {
  const snapshotDb = db.collection("order_snapshot");
  let pick_info = request.departure,
    drop_info =
      request.bizType === bussinessType.charter ? {} : request.destination,
    contact_name = request.contact_name,
    contact_phone = request.phone;

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

    const userInfo = await getUserInfo();
    contact_name = userInfo.contact_name || null;
    contact_phone = userInfo.contact_phone || null;
  }

  try {
    return await snapshotDb
      .add({
        data: {
          order_id: request.outTradeNo,
          pick_info,
          drop_info,
          contact_name,
          contact_phone,
          biz_type: request.bizType,
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
const getAddressInfo = async (address_id) => {
  try {
    const { result = {} } = await cloud.callFunction({
      name: "addressController",
      data: {
        action: "getAddressById",
        id: address_id,
      },
    });
    return +result.resultCode === 0 && result.resultData.id
      ? {
          id: result.resultData.id,
          ...result.resultData.addrInfo,
          is_pick: result.resultData.isPick,
          is_company: result.resultData.isCompany,
        }
      : {};
  } catch (e) {
    return {};
  }
};

/**
 * @description: 查询通勤用户信息
 * @return {Object} 用户信息
 */
const getUserInfo = async () => {
  const { OPENID } = cloud.getWXContext();
  try {
    const { result = {} } = await cloud.callFunction({
      name: "userController",
      data: {
        action: "getUserInfo",
        user_id: OPENID,
      },
    });

    return +result.resultCode === 0 && Object.keys(result.resultData).length
      ? {
          contact_name: result.resultData.user_name,
          contact_phone: result.resultData.user_phone,
        }
      : {};
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
        order_no: request.orderId,
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
