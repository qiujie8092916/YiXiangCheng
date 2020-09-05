// 云函数入口文件
const cloud = require("wx-server-sdk");
const nodemailer = require("nodemailer");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const auth = { user: "835413463@qq.com", pass: "sousifbnpxujbbif" };
const sendConfig = {
  auth,
  port: 465, // SMTP 端口
  service: "qq", // 使用内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  secureConnection: true, // 使用 SSL
};
const sendMailInstance = nodemailer.createTransport(sendConfig);

const bussinessType = {
  1: "包车",
  2: "通勤",
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let receivers = await db.collection("manager_mailer").get(),
    curReceivers = receivers.data.map(({ user }) => user).join(","),
    _params = { curReceivers, ...event.params };

  switch (event.action) {
    case "sendApprovalUserEmail": {
      return sendApprovalUserEmail(_params);
    }
    case "sendPickUpOrderEmail": {
      return sendPickUpOrderEmail(_params);
    }
    case "sendCancelOrderEmail": {
      return sendCancelOrderEmail(_params);
    }
    default:
      return;
  }
};

/**
 * @description: 发送审核用户邮件
 * @param {type}
 * @return {type}
 */
async function sendApprovalUserEmail(params) {
  let mailtemplate = {
    from: `"小享兽" <${auth.user}>`,
    to: params.curReceivers,
    subject: "小享兽注册通知",
    html: `<b>姓名：</b>${params.name}<br/><b>手机号：</b>${params.phone}<br/><br/>请于小程序云开发控制台手动审核<br/><br/>勿回复`,
  };
  try {
    await sendMailInstance.sendMail(mailtemplate);
    return {
      resultCode: 0,
      resultData: true,
    };
  } catch (err) {
    return {
      resultCode: -7,
      resultData: null,
      errMsg: err.toString(),
    };
  }
}

/**
 * @description: 发送提醒接单邮件
 * @param {type}
 * @return {type}
 */
async function sendPickUpOrderEmail(params) {
  let mailtemplate = {
    from: `"小享兽" <${auth.user}>`,
    to: params.curReceivers,
    subject: `有新的${bussinessType[params.snapshotDetail.biz_type]}订单`,
    html: `<b>订单号：</b>${params.order_no}<br/><b>乘车人：</b>${
      params.snapshotDetail.contact_name
    }<br/><b>手机号：</b>${
      params.snapshotDetail.contact_phone
    }<br/><b>用车时间：</b>${params.use_time}<br/><b>上车地点：</b>${
      params.snapshotDetail.pick_info.name
    }<br/>${
      params.snapshotDetail.biz_type === 2
        ? `<b>下车地点：</b>${params.snapshotDetail.drop_info.name}<br/>`
        : ``
    }<b>订单金额：</b>${
      params.pay_price / 100
    }元<br/><br/>请于小程序云开发控制台手动接单<br/><br/>勿回复`,
  };
  try {
    await sendMailInstance.sendMail(mailtemplate);
    return {
      resultCode: 0,
      resultData: true,
    };
  } catch (err) {
    return {
      resultCode: -7,
      resultData: null,
      errMsg: err.toString(),
    };
  }
}

/**
 * @description: 发送取消订单邮件
 * @param {type}
 * @return {type}
 */
async function sendCancelOrderEmail(params) {
  let mailtemplate = {
    from: `"小享兽" <${auth.user}>`,
    to: params.curReceivers,
    subject: `用户取消${bussinessType[params.snapshotDetail.biz_type]}订单`,
    html: `<b>用户取消订单${
      params.order_no
    }，请勿再次接单</b><br/><b>订单号：</b>${
      params.order_no
    }<br/><b>乘车人：</b>${
      params.snapshotDetail.contact_name
    }<br/><b>手机号：</b>${
      params.snapshotDetail.contact_phone
    }<br/><b>用车时间：</b>${params.use_time}<br/><b>上车地点：</b>${
      params.snapshotDetail.pick_info.name
    }<br/>${
      params.biz_type === 2
        ? `<b>下车地点：</b>${params.snapshotDetail.drop_info.name}<br/>`
        : ``
    }<b>订单金额：</b>${
      params.pay_price / 100
    }元<br/><br/>用户取消已支付订单！请与客户确认<br/><br/>勿回复`,
  };
  try {
    await sendMailInstance.sendMail(mailtemplate);
    return {
      resultCode: 0,
      resultData: true,
    };
  } catch (err) {
    return {
      resultCode: -7,
      resultData: null,
      errMsg: err.toString(),
    };
  }
}
