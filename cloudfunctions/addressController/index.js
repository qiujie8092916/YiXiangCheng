/**
 * ```
 * interface AddrInfo {
 *     name: string,  // 地址名称
 *     address: sring,  // 详细地址
 *     coordinate: array, // 经纬度
 *     province: string, // 省份
 *     city: string,  // 城市
 *     district: string,  // 地区
 *     area?: string,  // 园区
 * }
 *
 * interface AddressStructure {
 *     addrInfo: AddrInfo; // 地址基本信息
 *     isCompany: boolean; // 是否是公司地址
 *     isPick: boolean; // 是否是指定上下车地址
 * }
 * ```
 * @returns {promise<{resultCode: number, resultData: any, errMsg: string}>}
 */

// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = cloud.logger();
const db = cloud.database();

// 云函数入口函数
exports.main = async (request) => {
  console.log(request);
  switch (request.action) {
    case "getCompany": {
      return getCompany(request);
    }
    case "getPick": {
      return getPick(request);
    }
    case "getAddressById": {
      return getAddressById(request);
    }
    default: {
      return;
    }
  }
};

/**
 * @desc 获取公司地址列表
 */
const getCompany = async () => {
  try {
    const res = await generateSql({
      isCompany: 1,
    });
    return {
      resultCode: 0,
      resultData: res.list,
      errMsg: null,
    };
  } catch (e) {
    log.error({
      func: "getCompany",
      abnormal: e,
    });
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e.toString(),
    };
  }
};

/**
 * @desc 获取上下车地址列表
 */
const getPick = async (request) => {
  try {
    const res = await generateSql({
      isPick: 1,
    });
    return {
      resultCode: 0,
      resultData: res.list,
      errMsg: null,
    };
  } catch (e) {
    log.error({
      func: "getPick",
      abnormal: e,
    });
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e.toString(),
    };
  }
};

/**
 * @desc 根据id查询地址
 * @params {string} id
 */
const getAddressById = async (request) => {
  try {
    const res = await generateSql({ id: request.id });
    return {
      resultCode: 0,
      resultData: res.list.length ? res.list[0] : {},
      errMsg: null,
    };
  } catch (e) {
    log.error({
      func: "getAddressById",
      abnormal: e,
    });
    return {
      resultCode: -1,
      resultData: null,
      errMsg: e.toString(),
    };
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

  if (request.id) {
    queryFilter._id = request.id;
  }

  return db
    .collection("address")
    .aggregate()
    .addFields({
      id: "$_id",
      isPick: "$is_pick",
      isCompany: "$is_company",
      coordinates: "$coordinate.coordinates",
    })
    .addFields({
      addrInfo: {
        area: "$area",
        city: "$city",
        name: "$name",
        address: "$address",
        province: "$province",
        district: "$district",
        coordinates: "$coordinates",
      },
    })
    .match(queryFilter)
    .project({
      _id: 0,
      area: 0,
      city: 0,
      name: 0,
      is_pick: 0,
      address: 0,
      province: 0,
      district: 0,
      is_company: 0,
      coordinate: 0,
      coordinates: 0,
      create_time: 0,
      update_time: 0,
    })
    .end();
};
