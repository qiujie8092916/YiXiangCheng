// miniprogram/pages/charter/charter.js
// 包车下单页
import {
  bussinessType,
  charterDays,
  CHARTER_USER_TIME_DURATION,
} from "../../config";
import { Order, Storage, debounce } from "../../utils/index";

Page({
  data: {
    bussinessType: bussinessType.charter,
    departure: "", // 三里庵
    departureDefault: {}, // {name: "三里庵", latitude: 31.8512, longitude:117.26061, city:"合肥市", address:"105号", district: "蜀山区", province: "安徽省"}
    departure_time: "", // 选择时间
    duration: [
      {
        key: 4,
        value: "4小时",
      },
      {
        key: 8,
        value: "8小时",
      },
      {
        key: 12,
        value: "12小时",
      },
    ],
    charterdays: charterDays,
    chartercars: [],
    charterCarIdx: 0,
    charterDayIdx: 0,
    activeDuration: 4, // 套餐时长
    charterMoney: 0, // 价格
    phone: "", // 手机号
    contact_name: "", // 乘车联系人
    error_field: null, // 错误项
    shakeInvalidAnimate: {}, // 动画map
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 校验动画
   */
  createAnimation() {
    this.animate = wx.createAnimation({
      delay: 0,
      duration: 35,
      timingFunction: "ease",
    });
  },

  /**
   * 下单校验
   */
  preSubmit() {
    const animate = this.animate;
    animate
      .translateX(-5)
      .step()
      .translateX(4)
      .step()
      .translateX(-3)
      .step()
      .translateX(2)
      .step()
      .translateX(-1)
      .step()
      .translateX(0)
      .step();

    if (!this.data.phone) {
      this.setData({
        error_field: "phone",
        ["shakeInvalidAnimate.phone"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完成手机号授权",
      });
      return false;
    }

    if (!this.data.contact_name) {
      this.setData({
        error_field: "contact_name",
        ["shakeInvalidAnimate.contact_name"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完善乘车人",
      });
      return false;
    }

    if (!this.data.departure) {
      this.setData({
        error_field: "poi",
        ["shakeInvalidAnimate.poi"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完善上车点",
      });
      return false;
    }

    return true;
  },

  /**
   * 选择位置
   */
  choosePoi({ detail }) {
    console.log(detail, "detail");
    if (detail) {
      this.setData({
        departure: detail.name,
        departureDefault: detail,
      });
      Storage.setStorage("charterDeparture", JSON.stringify(detail));
      if (this.data.error_field === "poi") {
        this.setData({
          error_field: null,
        });
      }
    }
  },

  /**
   * 选择时间
   */
  calendarChange(d) {
    console.log(d.detail, "callback");
    this.setData({
      departure_time: d.detail,
    });
  },

  /**
   * 改变套餐
   */
  changeDuration(duration) {
    let _duration = duration.currentTarget.dataset.duration;
    this.setData({
      activeDuration: parseInt(_duration),
    });
    this.checkCharterPrice();
  },

  /**
   * 获取车型
   */
  getCloudCarInfo() {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "commonController",
          data: {
            action: "getCarInfoList",
          },
        })
        .then((res) => {
          if (res && res.result && res.result.resultData) {
            this.setData({
              chartercars: res.result.resultData,
            });
            this.checkCharterPrice();
            resolve();
          } else {
            console.log("获取车型失败");
            reject("获取车型失败");
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  /**
   * 获取用户信息
   */
  getCloudUserInfo() {
    const userInfo = Storage.getStorage("userInfo");

    return new Promise((resolve, reject) => {
      if (userInfo && userInfo.user_phone) {
        // 已经注册过无需再授权
        this.setData({
          phone: userInfo.user_phone,
        });
        resolve();
      } else {
        wx.cloud
          .callFunction({
            name: "userController",
            data: {
              action: "getUserInfo",
            },
          })
          .then((res) => {
            if (res && res.result && res.result.resultData) {
              this.setData({
                phone: res.result.resultData.user_phone,
              });
              Storage.setStorage(
                "userInfo",
                JSON.stringify(res.result.resultData)
              );
            } else {
              console.log("当前用户未注册");
            }
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }
    });
  },

  /**
   * 乘车人监听
   */
  inputUserName(e) {
    let _name = e.detail.value;
    this.debounce(_name);
  },

  /**
   * 乘车人debounce
   */
  debounceInputName(_name) {
    Storage.setStorage(
      "charterContactname",
      JSON.stringify(_name),
      9999 * 24 * 60
    );
    this.setData({
      contact_name: _name,
    });
    _name &&
      this.data.error_field === "contact_name" &&
      this.setData({
        error_field: null,
      });
  },

  /**
   * 预支付询问订阅
   */
  async gotoPayforOrder() {
    if (!this.preSubmit()) return;
    let _params = {
      departure: this.data.departureDefault,
      departure_time: this.data.departure_time,
      charter_duration: this.data.activeDuration,
      charter_day: JSON.parse(this.data.charterDayIdx) + 1, // 包车天数
      phone: this.data.phone,
      contact_name: this.data.contact_name,
      bizType: this.data.bussinessType,
      car_type: this.data.chartercars[this.data.charterCarIdx].type,
      total_price: 1, // this.data.charterMoney
    };
    // wx.cloud
    //   .callFunction({
    //     name: "orderController",
    //     data: {
    //       action: "checkWaitPayOrder",
    //     },
    //   })
    //   .then(async (res) => {
    //     if (
    //       res &&
    //       res.result &&
    //       res.result.resultData &&
    //       res.result.resultData.length > 0
    //     ) {
    //       wx.showModal({
    //         title: "提示",
    //         content: "您还有未支付订单",
    //         showCancel: false,
    //       });
    //     } else {

    if (Order.checkUserTime(bussinessType.charter, _params.departure_time)) {
      if (
        await Order.checkLossToAlert({
          biz_type: bussinessType.commute,
          use_time: _params.departure_time,
          loss_time: this.loss_time_obj.time,
          is_loss_time_history: this.loss_time_obj.isHistory,
        })
      ) {
        console.info("下单");
        const is_subscribe = await Order.subscribeOrderStatus();
        this.createWaitPayOrder({ is_subscribe, ..._params });
      } else {
        console.info("取消预订");
      }
    } else {
      wx.showModal({
        title: "",
        showCancel: false,
        content: `请选择未来${
          CHARTER_USER_TIME_DURATION[0] / 60 / 60 / 1000
        }小时至${
          CHARTER_USER_TIME_DURATION[1] / 24 / 60 / 60 / 1000
        }天内的用车时间`,
      });
    }

    //   }
    // })
    // .catch((e) => {
    //   wx.showModal({
    //     title: "提示",
    //     content: "请稍后重试",
    //     showCancel: false,
    //   });
    // });
  },

  /**
   * 下待支付订单
   */
  createWaitPayOrder(_params) {
    console.log(_params, "下单参数");
    Order.createOrder(_params).then((prePayResult) => {
      Order.invokePay(prePayResult.outTradeNo, prePayResult.payment)
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          wx.navigateTo({
            url: `/pages/orderDetail/orderDetail?orderId=${prePayResult.outTradeNo}`,
          });
        });
    });
  },

  /**
   * 获取手机号
   */
  getPhoneNumber(e) {
    wx.cloud
      .callFunction({
        name: "userController",
        data: {
          action: "getCellphone",
          id: e.detail.cloudID,
        },
      })
      .then((res) => {
        let { phoneNumber } = res.result.resultData;
        this.setData({
          phone: phoneNumber,
        });
        wx.cloud
          .callFunction({
            name: "userController",
            data: {
              action: "doReigsterCharter",
              phone: phoneNumber,
            },
          })
          .then((res) => {
            if (+res.result.resultCode === 0) {
              console.log("注册成功");
            } else {
              console.log("注册失败");
            }
          })
          .catch((err) => {
            console.log("注册失败", err);
          });
      })
      .catch((err) => {
        console.log("获取手机号失败", err);
      });
  },

  /**
   * 出发地初始化
   */
  checkDeparture() {
    let _departureDefault = Storage.getStorage("charterDeparture");
    if (_departureDefault) {
      console.log("_departureDefault", _departureDefault);
      this.setData({
        departure: _departureDefault.name,
        departureDefault: _departureDefault,
      });
    }
  },

  /**
   * 初始化价格
   */
  checkCharterPrice() {
    let _carPriceInfo = this.data.chartercars[this.data.charterCarIdx],
      carPrice =
        _carPriceInfo.charter_hour_price *
        this.data.charterdays[this.data.charterDayIdx] *
        JSON.parse(this.data.activeDuration);

    this.setData({
      charterMoney: carPrice,
    });
  },

  /**
   * 包车天数选择
   */
  bindDayChange(e) {
    this.setData({
      charterDayIdx: e.detail.value,
    });
    this.checkCharterPrice();
  },

  /**
   * 包车车型选择
   */
  bindCarChange(e) {
    this.setData({
      charterCarIdx: e.detail.value,
    });
    this.checkCharterPrice();
  },

  changeLossTime({ detail }) {
    this.loss_time_obj = detail;
  },

  /**
   * 初始化乘车人
   */
  initContactname() {
    this.setData({
      contact_name: Storage.getStorage("charterContactname"),
    });
  },

  /**
   * 初始化
   */
  async init() {
    /**
     * 全损时间obj
     * @default null
     * @type {?{ time: string, isHistory: boolean }}
     */
    this.loss_time_obj = null;
    // 输入乘车联系人debounce
    this.debounce = debounce(this.debounceInputName, 200);
    wx.showLoading();
    try {
      // 获取用户信息
      await this.getCloudUserInfo();
      // 获取车型信息
      await this.getCloudCarInfo();
      wx.hideLoading();
    } catch (error) {
      wx.showToast({
        title: error,
        icon: "none",
      });
    }
    // 初始化出发地
    this.checkDeparture();
    // 创建动画
    this.createAnimation();
    // 初始化乘车人
    this.initContactname();
  },
});
