// 云函数入口文件
const fs = require("fs");
const cloud = require("wx-server-sdk");

cloud.init();

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
    case "registerCommute": {
      return registerCommute(event);
    }
    case "registerCharter": {
      return registerCharter(event);
    }
    default: {
      return;
    }
  }
};

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  });
}

// 获取手机号
async function getCellphone(event) {
  const res = await cloud.getOpenData({
    list: [event.id],
  });
  return { res, event };
}

// 查询用户信息
async function getUserInfo(event) {
  const { OPENID } = cloud.getWXContext();
  const userInfoDb = db.collection("user_info");
  try {
    const result = await userInfoDb
      .where({
        user_id: OPENID,
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
    };
  }
}

// 包车注册
async function registerCharter(request) {
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
          user_type: 1,
          user_id: OPENID,
          union_id: UNIONID,
          employment_certificate: "",
          user_name: "",
          user_phone: request.phone,
          adress_id: "",
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

// 通勤注册
async function registerCommute(request) {
  if (!request.phone) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: "phone不能为空",
    };
  }

  if (!request.name) {
    return {
      resultCode: -2,
      resultData: null,
      errMsg: "name不能为空",
    };
  }

  if (!request.company) {
    return {
      resultCode: -3,
      resultData: null,
      errMsg: "company不能为空",
    };
  }

  if (!request.fileId) {
    return {
      resultCode: -4,
      resultData: null,
      errMsg: "文件id不能为空",
    };
  }

  try {
    try {
      const { OPENID, UNIONID } = cloud.getWXContext();
      await db.collection("user_info").add({
        data: [
          {
            status: 0,
            user_type: 1,
            user_id: OPENID,
            union_id: UNIONID,
            employment_certificate: request.fileId,
            user_name: request.name,
            user_phone: request.phone,
            adress_id: request.company,
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
  } catch (e) {
    console.error(e);
    return {
      resultCode: -6,
      resultData: null,
      errMsg: e,
    };
  }
}
