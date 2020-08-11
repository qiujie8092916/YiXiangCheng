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
          res &&
            res.result &&
            res.result.data &&
            this.setData({
              phone: res.result.data[0].user_phone,
              name: res.result.data[0].user_name,
            }) &&
            Storage.setStorage("userInfo", res.result.data[0]);
        });
    }
  },

  /**
   * 用户名监听
   */
  inputUserName(e) {
    this.setData({
      name: e.detail.value,
    });
  },
  /**
   * 去支付
   */
  gotoPayforOrder() {},

  /**
   * 获取手机号并注册
   */
  getPhoneNumber(e) {
    wx.cloud
      .callFunction({
        name: "userCommon",
        data: {
          action: "getCellphone",
          id: e.detail.cloudID,
        },
      })
      .then((res) => {
        console.log("res: ", res);
        // todo 注册
      });
  },

  /**
   * 初始化
   */
  init() {
    // 获取注册信息
    this.getCloudUserInfo();
    // 初始化套餐价格
    this.setData({
      charterMoney: this.data.moneyMap[this.data.activeDuration],
    });
  },
});
