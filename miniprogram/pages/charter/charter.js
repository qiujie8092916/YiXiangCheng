// miniprogram/pages/charter/charter.js
// 包车下单页
import Storage from "../../utils/storage";
import { bussinessType } from "../../config";
import { debounce, currentDatetime, isBefore, isAfter } from "../../utils/ext";

Page({
  data: {
    departure: "", // 上车地点
    departureDefault: {}, // 上车地点初始化
    departure_time: "", // 选择时间
    duration: [
      {
        key: "four",
        value: "4小时",
        money: 400,
      },
      {
        key: "eight",
        value: "8小时",
        money: 800,
      },
    ],
    moneyMap: {
      four: 400,
      eight: 800,
    }, // 价格表
    activeDuration: "four", // 套餐时长
    charterMoney: 0, // 当前时间
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
  onShow: function () {
    this.resetDepartureTime();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: async function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * 重置包车时间
   * 若离开此页面后重新回到此页面时当前显示时间已经是过去时间则重置显示时间
   */
  resetDepartureTime() {
    if (
      !this.data.departure_time ||
      isBefore(new Date(this.data.departure_time))
    ) {
      this.selectComponent("#datePicker").formatDateAndTime();
    }
  },

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
    if (detail) {
      this.setData({
        departure: detail.name,
        departureDefault: { name: detail.name },
      });
      Storage.setStorage(
        "charterDeparture",
        JSON.stringify({ name: detail.name })
      );
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
  changeTime(d) {
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
      activeDuration: _duration,
      charterMoney: this.data.moneyMap[_duration],
    });
  },

  /**
   * 获取用户信息
   */
  getCloudUserInfo() {
    const userInfo = Storage.getStorage("userInfo");

    if (userInfo && userInfo.user_phone) {
      // 已经注册过无需再授权
      this.setData({
        phone: userInfo.user_phone,
      });
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
   * 预支付
   */
  gotoPayforOrder() {
    if (!this.preSubmit()) return;
    let _params = {
      departure: this.data.departure,
      departure_time:
        this.data.departure_time && isAfter(new Date(this.data.departure_time))
          ? this.data.departure_time
          : currentDatetime(),
      phone: this.data.phone,
      contact_name: this.data.contact_name,
      bizType: bussinessType.charter,
      money: 1, // this.data.charterMoney
    };
    wx.showLoading();
    wx.cloud
      .callFunction({
        name: "orderController",
        data: {
          action: "createPerpayRequest",
          params: _params,
        },
      })
      .then(async (res) => {
        const payment = res.result.resultData.payment;
        const waitPayParams = Object.assign({}, _params, {
          outTradeNo: res.result.resultData.outTradeNo,
        });
        const orderDetailUrl = `/pages/orderDetail/orderDetail?orderId=${waitPayParams.outTradeNo}`;
        await this.createWaitPayOrder(waitPayParams);
        wx.hideLoading();
        wx.requestPayment({
          ...payment,
          success(res) {
            console.log("pay_success", res);
            wx.navigateTo({
              url: orderDetailUrl,
            });
          },
          fail(err) {
            console.error("pay_fail", err);
            if (err.errMsg === "requestPayment:fail cancel") {
              wx.navigateTo({
                url: orderDetailUrl,
              });
            }
          },
        });
      })
      .catch((err) => {
        console.error(err, "预支付error");
      });
  },

  /**
   * 创建待支付订单
   */
  createWaitPayOrder(_params) {
    console.log(_params, "包车下单参数");
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "orderController",
          data: {
            action: "createWaitPayOrder",
            params: _params,
          },
        })
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
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
    this.setData({
      charterMoney: this.data.moneyMap[this.data.activeDuration],
    });
  },

  /**
   * 初始化
   */
  init() {
    // 输入乘车联系人debounce
    this.debounce = debounce(this.debounceInputName, 200);
    // 获取用户信息
    this.getCloudUserInfo();
    // 初始化出发地
    this.checkDeparture();
    // 初始化套餐价格
    this.checkCharterPrice();
    // 创建动画
    this.createAnimation();
  },
});
