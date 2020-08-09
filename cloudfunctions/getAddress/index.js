/**
 * @params {-1|0|1} isCompany 是否是公司地址 -1-无论是否是公司 0-不是公司 1-是公司
 * @params {-1|0|1} isPick 是否是上下车地址 -1-无论是否是上下车地址 0-不是上下车地址 1-是上下车地址
 * @returns {promise<AddressStructure>}
 *
 * ```
 * interface AddressStructure {
 *
 *     name: string,  //地址名称
 *     address: sring,  //详细地址
 *     coordinate: array, //经纬度
 *     province: string, //省份
 *     city: string,  //城市
 *     district: string,  //地区
 *     area?: string,  //园区
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
exports.main = async (request) => {
  try {
    let sql = generateSql(request);
    const res = await sql;
    return new Respose().success(res.list).get();
  } catch (e) {
    console.error(e);
    const params =
      Object.prototype.toString.call(e) === "[object Array]"
        ? e
        : ["-1", "系统错误"];
    return new Respose().error(...params).get();
  }
};

/**
 * @desc 生成sql
 * @param {object} request 请求参数
 * @returns {Promise<DB.IQueryResult>}
 */
const generateSql = (request = {}) => {
  if (request.isPick !== undefined && ![-1, 0, 1].includes(request.isPick)) {
    throw [-2, "isPick 参数传入有误"];
  }

  if (
    request.isCompany !== undefined &&
    ![-1, 0, 1].includes(request.isCompany)
  ) {
    throw [-3, "isCompany 参数传入有误"];
  }

  let queryFilter = {};

  if (request.isPick === 0) {
    queryFilter.is_pick = false;
  }

  if (request.isPick === 1) {
    queryFilter.is_pick = true;
  }

  if (request.isCompany === 0) {
    queryFilter.is_company = false;
  }

  if (request.isCompany === 1) {
    queryFilter.is_company = true;
  }

  return db
    .collection("address")
    .aggregate()
    .addFields({
      area: "$area",
      city: "$city",
      name: "$name",
      address: "$address",
      province: "$province",
      district: "$district",
      coordinates: "$coordinate.coordinates",
    })
    .addFields({
      addrInfo: {
        coordinates: "$coordinates",
      },
    })
    .match(queryFilter)
    .project({
      area: 0,
      city: 0,
      name: 0,
      address: 0,
      province: 0,
      district: 0,
      coordinate: 0,
      coordinates: 0,
      create_time: 0,
      update_time: 0,
    })
    .end();
};
