// 云函数入口文件
const cloud = require("wx-server-sdk");
const Respose = require("../helper").Respose;

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async () => {
  try {
    const res = await db
      .collection("address")
      .where({
        isCompany: true,
      })
      .get();
    return new Respose().success(res.data).get();
  } catch (e) {
    console.error(e);
    return new Respose().error("-1", "系统错误").get();
  }
};
