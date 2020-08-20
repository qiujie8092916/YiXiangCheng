// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();
const ACTIONS = {
  create: ['createCharterOrder', "createCommuteOrder"],
  query: ['queryCharterOrder', "queryCommuteOrder"],
  cancel: ['cancelCharterOrder', "cancelCommuteOrder"],
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * @desc 创建包车订单
 * @param playload
 */
const createCharterOrder = async (playload) => {
  console.log('create charter')
}

/**
 * @desc 创建通勤订单
 * @param {object} playload
 * @param {0|1} playload.type 0-回家 1-上班
 * @param {0|1} playload.take 0-拼车 1-独享
 * @param {Array<number>} playload.from 坐标[longitude, latitude]
 * @param {Array<number>} playload.to 坐标[longitude, latitude]
 * @param {string} playload.time '2020-08-21 00:23:04'
 * @param {string|number} playload.price 实付金额
 */
const createCommuteOrder = async (playload) => {
  console.log(playload)
  await sleep(1000)
  return {
    resultCode: 0,
    resultData: true,
    errMsg: ''
  }
}

/**
 * @desc 查询包车订单
 * @param playload
 */
const queryCharterOrder = async (playload) => {
  console.log('query charter')
}

/**
 * @desc 查询通勤订单
 * @param {object} playload
 * @param {string} playload.orderId
 */
const queryCommuteOrder = async (playload) => {
  console.log('query commute')
}

/**
 * @desc 取消包车订单
 * @param playload
 */
const cancelCharterOrder = async (playload) => {
  console.log('cancel charter')
}

/**
 * @desc 取消通勤订单
 * @param playload
 */
const cancelCommuteOrder = async (playload) => {
  console.log('cancel commute')
}

// 云函数入口函数
/**
 * @desc 订单
 * @link 云开发支付 https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/open/pay/CloudPay.unifiedOrder.html
 * @param {RequestAction} event
 * @typedef RequestAction
 * @property {create|query|cancel} RequestAction.action create-创建订单 query-查询订单 cancel-取消订单
 * @property {1|2} RequestAction.bizType 1-包车 2-通勤
 * @returns {Promise<{resultCode: number, resultData: any, errMsg: string}>}
 */
exports.main = async (event) => {
  // genOrderNumber(event.bizType)
  console.log(event);

  const {action, bizType, ...playload} = event

  if(!['create', 'query', 'cancel'].includes(action)) {
    return {
      resultCode: -1,
      resultData: null,
      errMsg: 'action参数有误【create|query|cancel】'
    }
  }

  if(![1, 2].includes(bizType)) {
    return {
      resultCode: -2,
      resultData: null,
      errMsg: 'bizType参数有误【1-包车|2-通勤】'
    }
  }

  const funcName = ACTIONS[action][bizType - 1]

  // return await (new Function(`return ${funcName}(${JSON.stringify(playload)})`))()
  return await eval(`${funcName}(${JSON.stringify(playload)})`)
};

/**
 * @desc 生成订单号
 * @rule 一位产线类型（1：包车；2：通勤）+ 时间戳的九位（舍去第一位和后三位）+ 两位随机数 + userId的最后两位
 * @param {1|2} bizType 1-包车 2-通勤
 * @returns {string} 14位
 */
const genOrderNumber = (bizType) => {
  const timestamp = +new Date()
  const random = getRandomArbitrary()
  const { OPENID } = cloud.getWXContext()
  const orderNumber =  `${bizType}${timestamp.toString().slice(1, -3)}${random}${OPENID.slice(-2)}`

  console.log('timestamp', timestamp.toString())
  console.log('random', random)
  console.log('OPENID', OPENID)
  console.log('orderNumber', orderNumber, typeof orderNumber)

  return orderNumber
}

/**
 * @ 个位数补齐十位数
 * @param {number} s
 * @returns {string}
 */
const setTimeDateFmt = (s) => {
  return s < 10 ? ("0" + s) : ("" + s);
};

/**
 * @desc 生成两位随机数
 * @returns {string}
 */
const getRandomArbitrary = () => {
  return setTimeDateFmt(Math.floor(Math.random() * 100)).toString();
};
