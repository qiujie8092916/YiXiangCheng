// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = cloud.logger();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  switch (event.action) {
    case "getOpenData": {
      return getOpenData(event);
    }
    case "getCellphone": {
      return getCellphone(event);
    }
    case "getUserInfo": {
      return getUserInfo(event);
    }
    case "isRegisterCommute": {
      return isRegisterCommute(event);
    }
    case "doRegisterCommute": {
      return doRegisterCommute(event);
    }
    case "doReigsterCharter": {
      return doReigsterCharter(event);
    }
    case "getUserCompany": {
      return getUserCompany(event);
    }
    default: {
      return;
    }
  }
};

/**
 * @description: 获取隐秘信息
 * @param {type}
 * @return {type}
 */
async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  });
}

/**
 * @description: 获取手机号
 * @param {type}
 * @return {object}
 */
async function getCellphone(event) {
  try {
    const res = await cloud.getOpenData({
      list: [event.id],
    });
    const resultData = res.list[0].data;

    return { resultCode: 0, resultData: resultData };
  } catch (e) {
    return { resultCode: -1, resultData: null, errMsg: e };
  }
}

/**
 * @description: 查询用户信息
 * @param {object} request
 * @param {string} [request.user_id]
 * @return {object}
 */
async function getUserInfo(request) {
  const userInfoDb = db.collection("user_info");
  try {
    const result = await userInfoDb
      .where({
        user_id: request.user_id || cloud.getWXContext().OPENID,
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
}

/**
 * @desc 包车注册
 * @param {object} request 请求参数
 * @param {string} request.phone 手机号
 * @param {string} request.name 用户名
 * @param {string} request.company 公司id
 * @param {string} request.fileId 工作证明云文件id
 * @param {Boolean} request.is_send 是否发送订阅
 * @param {Boolean} request.is_subscribe 是否订阅
 * @returns {Promise<{resultCode: number, resultData: any, errMsg: string,}>}
 */
async function doReigsterCharter(request) {
  if (!request.phone) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: "phone不能为空",
    };
  }

  try {
    const { OPENID, UNIONID } = cloud.getWXContext();
    await db.collection("user_info").add({
      data: [
        {
          status: 0,
          user_id: OPENID,
          union_id: UNIONID,
          employment_certificate: "",
          user_name: "",
          user_phone: request.phone,
          address_id: "",
          is_send: false,
          is_subscribe: false,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
        },
      ],
    });
    return {
      resultCode: 0,
      resultData: true,
    };
  } catch (e) {
    return {
      resultCode: -5,
      resultData: null,
      errMsg: e,
    };
  }
}

/**
 * @desc 获取用户通勤注册情况
 * @brief 首页用
 * @returns {Promise<{resultCode: number, resultData: any, errMsg: string,}>}
 */
async function isRegisterCommute(request) {
  return new Promise(async (resolve) => {
    try {
      const { OPENID } = cloud.getWXContext();
      const { data } = await db
        .collection("user_info")
        .where({
          user_id: OPENID,
        })
        .get();

      if (data.length) {
        // resolve();
        const user = data[0];
        if (user.status === 1) {
          // 已通过审核
          return resolve({
            resultCode: 0,
            resultData: "/pages/commute/commute",
            errMsg: null,
          });
        } else if (user.status === 0) {
          // 未通过审核
          return resolve({
            resultCode: -1,
            resultData: null,
            errMsg: "管理员正在审核您的注册信息，请稍等...",
          });
        }
      }
      return resolve({
        resultCode: 0,
        resultData: "/pages/register/register",
        errMsg: null,
      });
    } catch (e) {
      return resolve({
        resultCode: -1,
        resultData: null,
        errMsg: e.toString(),
      });
    }
  });
}

/**
 * @desc 通勤注册
 * @param {object} request 请求参数
 * @param {string} request.phone 手机号
 * @param {string} request.name 用户名
 * @param {string} request.company 公司id
 * @param {string} request.fileId 工作证明云文件id
 * @param {boolean} request.isSubscribe 用户是否订阅了审核通过消息
 * @returns {Promise<{resultCode: number, resultData: any, errMsg: string,}>}
 */
async function doRegisterCommute(request) {
  return new Promise(async (resolve) => {
    if (!request.phone) {
      return resolve({
        resultCode: -1,
        resultData: null,
        errMsg: "phone不能为空",
      });
    }

    if (!request.name) {
      return resolve({
        resultCode: -2,
        resultData: null,
        errMsg: "name不能为空",
      });
    }

    if (!request.company) {
      return resolve({
        resultCode: -3,
        resultData: null,
        errMsg: "company不能为空",
      });
    }

    if (!request.fileId) {
      return resolve({
        resultCode: -4,
        resultData: null,
        errMsg: "文件id不能为空",
      });
    }

    try {
      const { OPENID, UNIONID } = cloud.getWXContext();
      const exist = await db
        .collection("user_info")
        .where({
          user_id: OPENID,
        })
        .get();

      if (exist.data.length) {
        if (exist.data[0].status === 0) {
          return resolve({
            resultCode: -8,
            resultData: null,
            errMsg: "管理员正在审核您的注册信息，请勿重复提交",
          });
        } else {
          return resolve({
            resultCode: -8,
            resultData: null,
            errMsg: "用户已注册",
          });
        }
      }
      log.info(request);
      await db.collection("user_info").add({
        data: [
          {
            status: 0,
            is_send: false,
            user_id: OPENID,
            union_id: UNIONID,
            user_name: request.name,
            user_phone: request.phone,
            address_id: request.company,
            create_time: db.serverDate(),
            update_time: db.serverDate(),
            is_subscribe: request.isSubscribe,
            employment_certificate: request.fileId,
          },
        ],
      });

      await cloud.callFunction({
        name: "sendMailController",
        data: {
          action: "sendApprovalUserEmail",
          params: { name: request.name, phone: request.phone },
        },
      });

      return resolve({
        resultCode: 0,
        resultData: true,
      });
    } catch (e) {
      return resolve({
        resultCode: -6,
        resultData: null,
        errMsg: e.toString(),
      });
    }
  });
}

/**
 * @desc 获取通勤注册用户的公司地址
 * @param request
 * @returns {Promise<{CompanyObject}>}
 */
const getUserCompany = async (request) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const _ = db.command;
    const $ = _.aggregate;
    const res = await db
      .collection("user_info")
      .aggregate()
      .lookup({
        from: "address",
        let: {
          user_address_id: "$address_id",
        },
        as: "company",
        pipeline: $.pipeline()
          .match(_.expr($.eq(["$_id", "$$user_address_id"])))
          .project({
            _id: 0,
            create_time: 0,
            update_time: 0,
          })
          .done(),
      })
      .match({
        user_id: OPENID,
      })
      .replaceRoot({
        newRoot: $.mergeObjects([
          {
            id: "$address_id",
          },
          $.arrayElemAt(["$company", 0]),
          "$$ROOT",
        ]),
      })
      .project({
        _id: 0,
        status: 0,
        company: 0,
        user_id: 0,
        user_name: 0,
        address_id: 0,
        user_phone: 0,
        update_time: 0,
        create_time: 0,
        employment_certificate: 0,
      })
      .end();

    if (!res.list.length) {
      return {
        resultCode: -2,
        resultData: null,
        errMsg: "查询用户信息失败",
      };
    }

    return {
      resultCode: 0,
      resultData: res.list[0],
      errMsg: null,
    };
  } catch (e) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e.toString(),
    };
  }
};
