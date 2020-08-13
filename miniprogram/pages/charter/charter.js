// miniprogram/pages/charter/charter.js
// 包车下单页
import Storage from "../../utils/storage";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    departure: "", // 上车地点
    duration: [
      {
        key: "four",
        value: "4小时",
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
    }, // money map
    activeDuration: "four", // 套餐时长
    charterMoney: 0, // 当前时间
    phone: "", // 手机号
    name: "", // 姓名
    error_field: null, // 错误项
    shakeInvalidAnimate: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
    this.createAnimation();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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

    if (!this.data.name) {
      this.setData({
        error_field: "name",
        ["shakeInvalidAnimate.name"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完善姓名",
      });
      return false;
    }

    if (!this.data.departure) {
      wx.showToast({
        icon: "none",
        title: "请选择上车地点",
      });
      return false;
    }

    return true;
  },

  /**
   * 选择位置
   */
  choosePoi({ detail }) {
    detail &&
      this.setData({
        departure: detail.address,
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
        name: userInfo.user_name,
      });
    } else {
      wx.cloud
        .callFunction({
          name: "userControl",
          data: {
            action: "getUserInfo",
          },
        })
        .then((res) => {
          if (res && res.result && res.result.resultData) {
            this.setData({
              phone: res.result.resultData.user_phone,
              name: res.result.resultData.user_name,
            });
            Storage.setStorage("userInfo", res.result.resultData);
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
   * 用户名监听
   */
  inputUserName(e) {
    let _name = e.detail.value;
    this.setData({
      name: _name,
    });
    _name &&
      this.data.error_field === "name" &&
      this.setData({
        error_field: null,
      });
  },
  /**
   * 去支付
   */
  gotoPayforOrder() {
    if (!this.preSubmit()) return;
  },

  /**
   * 获取手机号
   */
  getPhoneNumber(e) {
    wx.cloud
      .callFunction({
        name: "userControl",
        data: {
          action: "getCellphone",
          id: e.detail.cloudID,
        },
      })
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * 初始化
   */
  init() {
    // 获取用户信息
    this.getCloudUserInfo();
    // 初始化套餐价格
    this.setData({
      charterMoney: this.data.moneyMap[this.data.activeDuration],
    });
  },
});
