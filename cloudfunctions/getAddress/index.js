/**
 * @params {-1|0|1} isCompany 是否是公司地址 -1-无论是否是公司 0-不是公司 1-是公司
 * @params {-1|0|1} isPick 是否是上下车地址 -1-无论是否是上下车地址 0-不是上下车地址 1-是上下车地址
 * @returns {promise<AddressStructure>}
 *
 * ```
 * interface AddressStructure {
 *     name: string,  // 地址名称
 *     address: sring,  // 详细地址
 *     coordinate: array, // 经纬度
 *     province: string, // 省份
 *     city: string,  // 城市
 *     district: string,  // 地区
 *     area?: string,  // 园区
 * }
 * ```
 */
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
      .collection("specified_address")
      .aggregate()
      .lookup({})
      .where({
        is_company: true,
      })
      .get();
    return new Respose().success(res.data).get();
  } catch (e) {
    console.error(e);
    return new Respose().error("-1", "系统错误").get();
  }
};
