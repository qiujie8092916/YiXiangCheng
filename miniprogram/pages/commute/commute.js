// miniprogram/pages/commute/commute.js
import { routeConfig } from "../../config";

const QQMapWX = require("../../vendor/qqmap-wx-jssdk.min");
const qqmapsdk = new QQMapWX({ key: routeConfig.key });

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 表单错误字段
     * @type string
     */
    error_field: "",
    /**
     * 预估价
     * @type object
     */
    estimate: {
      sharing: 0,
      individual: 0,
    },
    current: "goHome",
    companyAddress: {},
    pickObj: {
      sharing: {},
      individual: {},
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
    /**
     * 必填项提示动画
     * @type Animation
     */
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
        name: "userController",
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

  submitPick({ detail }) {
    this.getEstimatePrice(detail.coordinates);
    this.setData({
      "pickObj.individual": detail,
    });
  },

  choosePoi({ detail }) {
    if (detail) {
      const coordinates = [detail.longitude, detail.latitude];
      this.getEstimatePrice(coordinates);
      this.setData({
        "pickObj.sharing": {
          id: 0,
          area: "",
          coordinates,
          name: detail.name,
          city: detail.city,
          address: detail.address,
          province: detail.province,
          district: detail.district,
        },
      });
    }
  },

  onTabsChange(e) {
    const current =
      e.currentTarget.dataset.key || e.detail.currentItemId || "goHome";

    if (current !== this.data.current) {
      this.getEstimatePrice(
        this.data.pickObj[this.data.activeType].coordinates
      );

      this.setData({
        current,
        error_field: "",
      });
    }
  },

  changeType({ currentTarget }) {
    const activeType = currentTarget.dataset.type;
    if (activeType !== this.data.activeType) {
      this.setData(
        {
          activeType,
        },
        () => {
          this.getEstimatePrice(this.data.pickObj[activeType].coordinates);
        }
      );
    }
  },

  getEstimatePrice(coordinates) {
    if (coordinates && coordinates.length) {
      wx.showLoading({ title: "请稍等" });

      const params = { mode: "driving" },
        pickCoordinates = JSON.parse(JSON.stringify(coordinates)),
        companyCoordinates = JSON.parse(
          JSON.stringify(this.data.companyAddress.coordinate.coordinates)
        );
      if (this.data.current === "goHome") {
        params.from = companyCoordinates.reverse().join(",");
        params.to = pickCoordinates.reverse().join(",");
      } else {
        params.from = pickCoordinates.reverse().join(",");
        params.to = companyCoordinates.reverse().join(",");
      }

      console.log(params);
      qqmapsdk.direction({
        ...params,
        success: ({ result }) => {
          this.setData({
            ["estimate." + this.data.activeType + ""]: result.routes[0]
              .taxi_fare.fare,
          });
          wx.hideLoading();
        },
        fail(err) {
          wx.hideLoading({
            complete() {
              wx.showToast({
                icon: "none",
                title: err.message.toString(),
              });
            },
          });
        },
      });
    }
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

    if (!Object.keys(this.data.pickObj[this.data.activeType]).length) {
      const shakeInvalidAnimate = {
        [this.data.activeType]: animate.export(),
      };
      this.setData({
        error_field: this.data.activeType,
        shakeInvalidAnimate,
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
