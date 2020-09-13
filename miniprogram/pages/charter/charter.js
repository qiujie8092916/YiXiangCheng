// miniprogram/pages/charter/charter.js
// 包车下单页
import { bussinessType } from "../../config";
import {
  Order,
  Storage,
  isAfter,
  isBefore,
  debounce,
  currentDatetime,
  normalDateformat,
} from "../../utils/index";

Page({
  data: {
    departure: "", // 上车地点: 三里庵合肥市蜀山区人民政府(南一环路南)
    departureDefault: {}, // 上车地点初始化: {name: "三里庵合肥市蜀山区人民政府(南一环路南)", latitude: 31.8512, longitude:117.26061, city:"合肥市", address:"安徽省合肥市蜀山区梅山路105号", district: "蜀山区", province: "安徽省"}
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
      {
        key: "twelve",
        value: "12小时",
        money: 1200,
      },
    ],
    charterdays: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
    ],
    charterDayIdx: 0,
    moneyMap: {
      four: 400,
      eight: 800,
      twelve: 1200,
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
      isBefore(normalDateformat(this.data.departure_time))
    ) {
      console.log("重置时间");
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
  changeTime(d) {
    console.log(d.detail);
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
   * 预支付询问订阅
   */
  async gotoPayforOrder() {
    if (!this.preSubmit()) return;
    let _params = {
      departure: this.data.departureDefault,
      departure_time:
        this.data.departure_time &&
        isAfter(normalDateformat(this.data.departure_time))
          ? this.data.departure_time
          : currentDatetime(),
      charter_duration:
        this.data.activeDuration === "four"
          ? 4
          : this.data.activeDuration === "eight"
          ? 8
          : 12,
      charter_day: JSON.parse(this.data.charterDayIdx) + 1, // 包车天数
      phone: this.data.phone,
      contact_name: this.data.contact_name,
      bizType: bussinessType.charter,
      total_price: 1, // this.data.charterMoney
    };

    const is_subscribe = await Order.subscribeOrderStatus();
    this.createWaitPayOrder({ is_subscribe, ..._params });
  },

  /**
   * 下待支付订单
   */
  createWaitPayOrder(_params) {
    console.log(_params, "下单参数");
    Order.createOrder(_params).then((prePayResult) => {
      Order.invokePay(prePayResult.outTradeNo, prePayResult.payment)
        .catch((e) => console.error(e))
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
    this.setData({
      charterMoney: this.data.moneyMap[this.data.activeDuration],
    });
  },

  bindDayChange(e) {
    this.setData({
      charterDayIdx: e.detail.value,
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
