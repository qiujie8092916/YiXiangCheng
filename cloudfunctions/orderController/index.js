// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const log = cloud.logger();

const bussinessType = {
  charter: 1,
  commute: 2,
};

/**
 * 微信支付 共同参数
 */
const wxPayComm = {
  sub_mch_id: "1601995626",
  env_id: "test-ey84k", // cloud.DYNAMIC_CURRENT_ENV,
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
    case "doCancelOrder": {
      return doCancelOrder(event.params);
    }
    case "queryRefund": {
      return queryRefund(event.params);
    }
    case "checkOrderList": {
      return checkOrderList(event.params);
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
      envId: wxPayComm.env_id,
      subMchId: wxPayComm.sub_mch_id,
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
          refund_id: null,
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
  const _ = db.command;
  const $ = _.aggregate;
  const orderInfoDb = db.collection("order_info");
  log.info({
    name: "查询订单详情入参",
    value: request,
  });
  try {
    const result = await orderInfoDb
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
      .lookup({
        from: "driver_info",
        let: {
          driver_id: "$driver_id",
        },
        pipeline: $.pipeline()
          .match(_.expr($.eq(["$_id", "$$driver_id"])))
          .project({
            create_time: 0,
            update_time: 0,
          })
          .done(),
        as: "driverDetail",
      })
      .lookup({
        from: "refund_info",
        let: {
          order_no: "$order_no",
        },
        pipeline: $.pipeline()
          .match(_.expr($.eq(["$order_no", "$$order_no"])))
          .project({
            _id: 0,
            user_id: 0,
            order_id: 0,
            create_time: 0,
            update_time: 0,
          })
          .done(),
        as: "refundDetail",
      })
      .match({
        order_no: request.orderId,
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

    return {
      resultCode: 0,
      resultData: result.list.length ? result.list[0] : null,
    };
  } catch (e) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: (e.errMsg || e).toString(),
    };
  }
};

/**
 * @description: 取消订单
 * @param {type}
 * @return {type}
 */
const doCancelOrder = async (request) => {
  let is_refund = false,
    refund_id,
    refund_fee;
  console.log(request.orderId, "order_no");
  try {
    const {
      resultData: orderDetail,
      resultCode,
      errMsg,
    } = await checkOrderDetail(request);
    if (resultCode !== 0) {
      throw errMsg;
    }

    log.info({ name: "取消订单发起参数", ...orderDetail });
    console.log(orderDetail);

    if (orderDetail.order_status === 1) {
      // 未支付 可取消但不发邮件
    } else if (orderDetail.order_status === 4) {
      return {
        resultCode: -1,
        errMsg: "已上车，不能取消订单",
      };
    } else if (orderDetail.order_status === 5) {
      return {
        resultCode: -1,
        errMsg: "订单已取消，请勿重复取消订单",
      };
    } else if (orderDetail.order_status === 6) {
      return {
        resultCode: -1,
        errMsg: "订单已退款，请勿重复取消订单",
      };
    } else if (orderDetail.order_status === 10) {
      return {
        resultCode: -1,
        errMsg: "订单已完成，不能取消订单",
      };
    } else {
      is_refund = true;

      await cloud.callFunction({
        name: "sendMailController",
        data: {
          action: "sendCancelOrderEmail",
          params: orderDetail,
        },
      });

      // 已支付 可取消
      const refundOrder = await createRefundOrder(orderDetail.order_no);

      // 发起微信退款
      const { returnCode, returnMsg, ...rest } = await cloud.cloudPay.refund({
        sub_mch_id: wxPayComm.sub_mch_id, // 子商户号
        nonce_str: payRandomWord(), // 随机字符串
        transaction_id: orderDetail.pay_serial_no, // 微信订单号（与商户订单号二选一填入）
        out_trade_no: orderDetail.order_no, // 商户订单号
        out_refund_no: refundOrder.refund_no, //商户退款单号？用订单号？
        total_fee: orderDetail.pay_price, // 订单金额（支付金额）
        refund_fee: orderDetail.pay_price, // 退款金额
        // refund_fee_type: 'CNY', // 货币种类
        // refund_desc: '用户主动发起退款',  // 退款原因
        // refund_account: // 退款资金来源
      });

      refund_fee = rest.cashRefundFee;
      refund_id = refundOrder.refund_id;

      log.info({ name: "微信退款返回参数", ...returnCode, ...returnMsg });

      if (returnCode === "FAIL") {
        return {
          resultCode: -2,
          errMsg: returnMsg,
        };
      } else {
        await updateRefundOrder(refund_id, rest);
      }
    }

    // 更新订单状态
    await updateOrderStatusToCancel({
      order_no: request.orderId,
      refund_id,
      refund_fee,
    });

    if (is_refund) {
      return {
        resultCode: -2,
        errMsg: "已发起退款，款项将会原路返回，请耐心等待",
      };
    } else {
      return {
        resultCode: 0,
        resultData: true,
      };
    }
  } catch (e) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: (e.errMsg || e).toString(),
    };
  }
};

const createRefundOrder = async (order_no) => {
  return new Promise((resolve, reject) => {
    const { OPENID } = cloud.getWXContext();
    const refund_no = genOrderNumber(+order_no.slice(0, 1));
    const refundInfoDb = db.collection("refund_info");
    refundInfoDb
      .add({
        data: {
          user_id: OPENID,
          update_time: null,
          order_no: order_no,
          refund_no: refund_no,
          create_time: db.serverDate(),
        },
      })
      .then((res) => {
        resolve({ refund_id: res._id, refund_no });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateRefundOrder = async (refund_id, rest) => {
  const refundInfoDb = db.collection("refund_info");
  try {
    await refundInfoDb
      .where({
        _id: refund_id,
      })
      .update({
        data: {
          ...rest,
          update_time: db.serverDate(),
        },
      });
    return {
      resultCode: 0,
      resultData: true,
    };
  } catch (e) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e.toString(),
    };
  }
};

/**
 * @desc 取消订单，更新订单状态
 * @param {string} order_no
 * @return {Promise<void|ErrorEvent>}
 */
const updateOrderStatusToCancel = async ({
  order_no,
  refund_id,
  refund_fee,
}) => {
  try {
    const orderInfoDb = db.collection("order_info");
    await orderInfoDb
      .where({
        order_no,
      })
      .update({
        data: {
          order_status: 5,
          refund_fee: refund_fee || 0,
          refund_id: refund_id || null,
          refund_time: db.serverDate(),
          update_time: db.serverDate(),
        },
      });
    return await Promise.resolve();
  } catch (e) {
    return await Promise.reject(e);
  }
};

/**
 * @description: 获取订单列表
 * @param {type}
 * @return {type}
 */
const checkOrderList = async (request) => {
  try {
    const { list: data } = await genOrderListSql()
      .skip(request.pageIndex * request.pageSize)
      .limit(request.pageSize)
      .end();

    const { list: res } = await genOrderListSql().count("rows").end();

    return {
      resultCode: 0,
      resultData: {
        data,
        current: request.pageIndex,
        pageSize: request.pageSize,
        rows: res.length ? res[0].rows : 0,
      },
    };
  } catch (e) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: (e.errMsg || e).toString(),
    };
  }
};

/**
 * @desc 获取订单列表sql
 * @brief 因生成的sql会因为附加的执行生成新的instance，所以两次查询返回新sql
 * @return {DB.Aggregate}
 */
const genOrderListSql = () => {
  const { OPENID } = cloud.getWXContext();
  const _ = db.command;
  const $ = _.aggregate;
  const orderInfoDb = db.collection("order_info");
  return orderInfoDb
    .aggregate()
    .sort({
      create_time: -1,
    })
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
    .lookup({
      from: "driver_info",
      let: {
        driver_id: "$driver_id",
      },
      pipeline: $.pipeline()
        .match(_.expr($.eq(["$_id", "$$driver_id"])))
        .project({
          create_time: 0,
          update_time: 0,
        })
        .done(),
      as: "driverDetail",
    })
    .lookup({
      from: "refund_info",
      let: {
        order_no: "$order_no",
      },
      pipeline: $.pipeline()
        .match(_.expr($.eq(["$order_no", "$$order_no"])))
        .project({
          _id: 0,
          user_id: 0,
          order_id: 0,
          create_time: 0,
          update_time: 0,
        })
        .done(),
      as: "refundDetail",
    })
    .match({
      user_id: OPENID,
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
      refund_time: 1,
      total_price: 1,
      commute_way: 1,
      is_subscribe: 1,
      order_status: 1,
      commute_type: 1,
      charter_duration: 1,
      refundDetail: $.arrayElemAt(["$refundDetail", 0]),
      driverDetail: $.arrayElemAt(["$driverDetail", 0]),
      snapshotDetail: $.arrayElemAt(["$snapshotDetail", 0]),
    });
};

const queryRefund = async (request) => {
  try {
    const { returnCode, returnMsg, ...rest } = await cloud.cloudPay.refund({
      nonce_str: payRandomWord(), // 随机字符串
      out_trade_no: request.orderId,
      sub_mch_id: wxPayComm.sub_mch_id,
    });

    if (returnCode === "FAIL") {
      throw returnMsg;
    }

    return {
      resultCode: 0,
      resultData: rest,
    };
  } catch (e) {
    return {
      resultCode: -1,
      errMsg: (e.errMsg || e).toString(),
    };
  }
};
