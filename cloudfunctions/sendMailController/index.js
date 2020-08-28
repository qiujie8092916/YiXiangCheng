// 云函数入口文件
const cloud = require("wx-server-sdk");
const nodemailer = require("nodemailer");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const auth = { user: "835413463@qq.com", pass: "jddqsbarkcfybcgj" };
const sendConfig = {
  auth,
  port: 465, // SMTP 端口
  service: "qq", // 使用内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  secureConnection: true, // 使用 SSL
};
const sendMailInstance = nodemailer.createTransport(sendConfig);

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
    from: `"service" <${auth.user}>`,
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
    from: `"service" <${auth.user}>`,
    to: params.curReceivers,
    subject: "有新的订单",
    html: `请尽快进入小程序后台管理系统进行接单`,
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
