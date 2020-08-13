// 云函数入口文件
const cloud = require("wx-server-sdk");
const nodemailer = require("nodemailer");

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
    case "isRegisterCommute": {
      return isRegisterCommute(event);
    }
    case "doRegisterCommute": {
      return doRegisterCommute(event);
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

/**
 * @desc 通勤注册
 * @param {object} request 请求参数
 * @param {string} request.phone 手机号
 * @param {string} request.name 用户名
 * @param {string} request.company 公司id
 * @param {string} request.fileId 工作证明云文件id
 * @returns {Promise<{resultCode: number, resultData: any, errMsg: string,}>}
 */
async function doRegisterCommute(request) {
  return new Promise(async (resolve) => {
    if (!request.phone) {
      resolve({
        resultCode: -1,
        resultData: null,
        errMsg: "phone不能为空",
      });
    }

    if (!request.name) {
      resolve({
        resultCode: -2,
        resultData: null,
        errMsg: "name不能为空",
      });
    }

    if (!request.company) {
      resolve({
        resultCode: -3,
        resultData: null,
        errMsg: "company不能为空",
      });
    }

    if (!request.fileId) {
      resolve({
        resultCode: -4,
        resultData: null,
        errMsg: "文件id不能为空",
      });
    }

    try {
      const { OPENID, UNIONID } = cloud.getWXContext();
      const isRegistered = await db
        .collection("user_info")
        .where({
          user_type: 1,
          user_id: OPENID,
        })
        .count();

      if (isRegistered.total) {
        resolve({
          resultCode: -8,
          resultData: null,
          errMsg: "用户已注册",
        });
      }

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

      // 发送邮件
      const auth = { user: "835413463@qq.com", pass: "jddqsbarkcfybcgj" },
        transporter = nodemailer.createTransport({
          auth,
          port: 465, // SMTP 端口
          service: "qq", // 使用内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
          // host: 'smtp.ethereal.email',
          secureConnection: true, // 使用 SSL
        }),
        receivers = await db.collection("mailer").get(); //获取收件人列表

      transporter.sendMail(
        {
          from: `"service" <${auth.user}>`,
          to: receivers.data.map(({ user }) => user).join(","),
          // cc: "",
          subject: "小享兽注册通知",
          // 发送text或者html格式
          // text: 'Hello world?', // plain text body
          html: `<b>姓名：</b>${request.name}<br/><b>手机号：</b>${request.phone}<br/><br/>请于小程序云开发控制台手动审核<br/><br/>勿回复`, //fs.createReadStream(path.resolve(__dirname, 'email.html')) // 流
        },
        (error, info) => {
          if (error) {
            resolve({
              resultCode: -7,
              resultData: null,
              errMsg: error.toString(),
            });
          }

          resolve({
            resultCode: 0,
            resultData: true,
          });
        }
      );
    } catch (e) {
      resolve({
        resultCode: -6,
        resultData: null,
        errMsg: e.toString(),
      });
    }
  });
}
