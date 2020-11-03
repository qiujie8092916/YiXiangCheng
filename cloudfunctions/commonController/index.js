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
    case "getCarInfoList": {
      return getCarInfoList(event);
    }
    default: {
      return;
    }
  }
};

/**
 * @description: 获取车型
 * @param {type}
 * @return {object}
 */
async function getCarInfoList(event) {
  const carInfoDb = db.collection("car_info");
  try {
    const result = await carInfoDb.get();

    return {
      resultCode: 0,
      resultData: result.data ? result.data : null,
    };
  } catch (e) {
    log.error({
      func: "getCarInfoList",
      abnormal: e,
    });
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e,
    };
  }
}
