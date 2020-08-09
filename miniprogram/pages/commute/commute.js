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
    companyAddress: {
      area: "凌空SOHO",
      name: "Sky Bridge HQ天会",
      address: "上海市长宁区金钟路968号",
    },
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

  init() {
    wx.cloud.callFunction({
      name: "getAllCompanyAddress",
      data: {},
      success: (res) => {
        console.log(res.result);
      },
    });
  },

  choosePoi({ detail }) {
    console.log(detail);
  },

  onTabsChange({ currentTarget }) {
    this.setData({
      current: currentTarget.dataset.key,
    });
  },

  changeType({ currentTarget }) {
    this.setData({
      activeType: currentTarget.dataset.type,
    });
  },
});
