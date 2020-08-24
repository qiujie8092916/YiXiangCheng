// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const log = cloud.logger();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const res = await db
      .collection("user_info")
      .where({
        user_type: 1,
        is_send: false,
        is_subscribe: true,
      })
      .get();

    res.data.map(async (user) => {
      // 已审核通过 && 是通勤注册 && 已订阅 && 未发送
      if (
        user.status === 1 &&
        user.employment_certificate &&
        user.address_id &&
        user.is_subscribe &&
        !user.is_send
      ) {
        log.info({
          value: "准备下发",
        });
        const result = await cloud.openapi.subscribeMessage.send({
          data: {
            thing3: {
              value: "注册信息已通过，请前往小程序下单吧",
            },
            phrase1: {
              value: "注册成功",
            },
          },
          lang: "zh_CN",
          touser: user.user_id,
          page: "pages/home/home",
          miniprogramState: "developer", //developer trial formal
          templateId: "tmuTKASNdq3h637YPkUSp9t57ePCCougAKaSzbEJvKo",
        });
        if (result.errCode === 0) {
          log.info({
            value: "审核通过，消息下发",
          });

          db.collection("user_info")
            .where({
              user_type: 1,
              user_id: user.user_id,
            })
            .update({
              data: {
                is_send: true,
              },
            });
        } else {
          log.error({
            value: result.errMsg,
          });
        }
      }
    });
  } catch (e) {
    log.error({
      value: e,
    });
  }
};
