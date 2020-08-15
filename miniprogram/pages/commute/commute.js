// miniprogram/pages/commute/commute.js
import { routeConfig } from "../../config";

const QQMapWX = require("../../vendor/qqmap-wx-jssdk.min");
const qqmapsdk = new QQMapWX({ key: routeConfig.key });

Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: "goHome",
    companyAddress: {},
    pickObj: {},
    tabs: [
      {
        key: "goHome",
        title: "享回家",
      },
      {
        key: "goWork",
        title: "享上班",
      },
    ],
    type: [
      {
        key: "sharing",
        value: "拼车",
      },
      {
        key: "individual",
        value: "独享",
      },
    ],
    activeType: "sharing",
    // 必填项提示动画
    shakeInvalidAnimate: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* qqmapsdk.direction({
      mode: "driving",
      from: "31.265786,121.434803",
      to: "31.221023,121.354423",
      success: (res) => {
        console.log(res);
      },
    });*/

    //TODO 更新skecth表结构
    wx.showLoading({ title: "加载中" });
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
  // onShareAppMessage: function () {},

  async init() {
    try {
      const { result = {} } = await wx.cloud.callFunction({
        name: "userControl",
        data: {
          action: "getUserCompany",
        },
      });
      if (+result.resultCode !== 0) {
        throw result.errMsg;
      }
      this.setData({
        companyAddress: result.resultData,
      });
      wx.hideLoading();
    } catch (e) {
      wx.hideLoading({
        complete() {
          wx.showToast({
            icon: "none",
            title: JSON.stringify(e),
          });
        },
      });
    }
  },

  createAnimation() {
    this.animate = wx.createAnimation({
      delay: 0,
      duration: 35,
      timingFunction: "ease",
    });
  },

  choosePoi({ detail }) {
    console.log(detail);
  },

  onTabsChange(e) {
    const current =
      e.currentTarget.dataset.key || e.detail.currentItemId || "goHome";

    this.setData({
      current,
    });
  },

  changeType({ currentTarget }) {
    this.setData({
      activeType: currentTarget.dataset.type,
    });
  },

  submitPick({ detail }) {
    this.setData({
      pickObj: detail,
    });
  },

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

    if (!Object.keys(this.data.pickObj).length) {
      this.setData({
        error_field: "pick",
        ["shakeInvalidAnimate.pick"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: `请完善${this.data.current === "goHome" ? "下" : "上"}车地址`,
      });
      return false;
    }

    return true;
  },

  onsubmit() {
    if (!this.preSubmit()) return;
  },
});
