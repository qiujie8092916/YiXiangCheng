// miniprogram/pages/charter/charter.js
// 包车下单页
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { userStore as store } from "../../store/index";

Page({
  /**
   * 页面的初始数据
   */
  data: {
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
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },

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
    console.log(detail);
  },

  /**
   * 改变套餐
   */
  changeDuration(duration) {
    console.log(this.data.userInfo.nickName, "userInfo");
    this.setData({
      activeDuration: duration.currentTarget.dataset.duration,
      charterMoney: this.data.moneyMap[duration.currentTarget.dataset.duration],
    });
  },

  /**
   * 获取用户信息
   */
  getCloudUserInfo() {
    const userInfo = this.data.userInfo;
    if (userInfo && userInfo.phoneNumber) {
      // 已经注册过无需再授权
    } else {
      wx.cloud
        .callFunction({
          name: "openapi",
          data: {
            action: "getUserInfo",
          },
        })
        .then((res) => {
          console.log("res: ", res);
          this.updateUserInfo(res);
        });
    }
  },

  /**
   * 去支付
   */
  gotoPayforOrder(e) {
    console.log(JSON.stringify(e));
    wx.cloud
      .callFunction({
        name: "openapi",
        data: {
          action: "getCellphone",
          id: e.detail.cloudID,
        },
      })
      .then((res) => {
        console.log("res: ", res);
      });
  },
  // 初始化操作
  init() {
    // 初始化store
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"],
      actions: ["updateUserInfo"],
    });
    // 获取注册信息
    this.getCloudUserInfo();
    // 初始化套餐价格
    this.setData({
      charterMoney: this.data.moneyMap[this.data.activeDuration],
    });
  },
});
