// 云函数入口文件
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
  const result = await userInfoDb
    .where({
      user_id: OPENID,
    })
    .get();

  return result;
}
