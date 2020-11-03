// miniprogram/pages/commute/commute.js
/**
 * @summary
 *  参考README之ChangeLog - 2020.09.29
 *  独享/拼车的选点逻辑与之前相反
 *  便捷修改，只改中文名，不改变量名
 */
import {
  bussinessType,
  routeConfig,
  COMMUTE_USER_TIME_DURATION,
} from "../../config";
import { Order } from "../../utils/index";

const QQMapWX = require("../../vendor/qqmap-wx-jssdk.min");
const qqmapsdk = new QQMapWX({ key: routeConfig.key });

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bussinessType: bussinessType.commute,
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
    time: "",
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
        value: "独享", // "享拼",
      },
      {
        key: "individual",
        value: "享拼", // "独享",
      },
    ],
    activeType: "sharing",
    /**
     * 必填项提示动画
     * @type Animation
     */
    shakeInvalidAnimate: {},
    chartercars: [],
    charterCarIdx: 0,
    distance: 0,
    duration: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 全损时间obj
     * @default null
     * @type {?{ time: string, isHistory: boolean }}
     */
    this.loss_time_obj = null;
    // 加载用户公司地址
    this.init();
    // 创建动画
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
    wx.showLoading({ title: "加载中" });

    try {
      this.getCloudCarInfo();
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

  /**
   * 获取车型
   */
  getCloudCarInfo() {
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
        } else {
          console.log("获取车型失败");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  calendarChange({ detail }) {
    console.log(detail);
    this.setData({
      time: detail,
    });
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
      this.setData(
        {
          current,
          error_field: "",
        },
        () => {
          this.getEstimatePrice(
            this.data.pickObj[this.data.activeType].coordinates
          );
        }
      );
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
      wx.showLoading({ title: "加载中" });

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
          console.log(result);
          let _price =
            (result.routes[0].distance / 1000) *
              this.data.chartercars[this.data.charterCarIdx]
                .commute_kilometre_price +
            result.routes[0].duration *
              this.data.chartercars[this.data.charterCarIdx].commute_min_price +
            this.data.chartercars[this.data.charterCarIdx].commute_start_price;

          console.log(_price, "_price");

          this.setData({
            ["estimate." + this.data.activeType + ""]:
              this.data.activeType === "sharing"
                ? _price.toFixed(2)
                : (_price * 0.7).toFixed(2),
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

  /**
   * @desc 组装下单参数
   */
  genParams() {
    let departure, destination;

    if (this.data.current === "goHome") {
      departure = this.data.companyAddress.id;
      destination =
        this.data.pickObj[this.data.activeType].id ||
        this.data.pickObj[this.data.activeType];
    } else {
      departure =
        this.data.pickObj[this.data.activeType].id ||
        this.data.pickObj[this.data.activeType];
      destination = this.data.companyAddress.id;
    }

    return {
      departure,
      destination,
      total_price: 1, //this.data.estimate[this.data.activeType] * 100, // 实付金额
      bizType: this.data.bussinessType,
      commute_type: this.data.current === "goHome" ? 0 : 1, // 0-回家 1-上班
      commute_way: this.data.activeType === "sharing" ? 0 : 1, // 0-拼车 1-独享
      car_type: this.data.chartercars[this.data.charterCarIdx].type,
      departure_time: this.data.time,
    };
  },

  changeLossTime({ detail }) {
    this.loss_time_obj = detail;
  },

  /**
   * @desc 创建通勤订单
   */
  async onsubmit() {
    if (!this.preSubmit()) return;

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
    const params = this.genParams();
    if (Order.checkUserTime(bussinessType.commute, params.departure_time)) {
      if (
        await Order.checkLossToAlert({
          biz_type: bussinessType.commute,
          use_time: params.departure_time,
          loss_time: this.loss_time_obj.time,
          is_loss_time_history: this.loss_time_obj.isHistory,
        })
      ) {
        console.info("下单");
        const is_subscribe = await Order.subscribeOrderStatus();
        this.createWaitPayOrder({ is_subscribe, ...params });
      } else {
        console.info("取消预订");
      }
    } else {
      wx.showModal({
        title: "",
        showCancel: false,
        content: `请选择未来${
          COMMUTE_USER_TIME_DURATION[0] / 60 / 60 / 1000
        }小时至${
          COMMUTE_USER_TIME_DURATION[1] / 24 / 60 / 60 / 1000
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
  createWaitPayOrder(params) {
    console.log(params, "下单参数");
    Order.createOrder(params).then((prePayResult) => {
      Order.invokePay(prePayResult.outTradeNo, prePayResult.payment)
        .catch((e) => console.error(e))
        .finally(() => {
          wx.navigateTo({
            url: `/pages/orderDetail/orderDetail?orderId=${prePayResult.outTradeNo}`,
          });
        });
    });
  },

  bindCarChange(e) {
    this.setData(
      {
        charterCarIdx: e.detail.value,
      },
      () => {
        this.getEstimatePrice(
          this.data.pickObj[this.data.activeType].coordinates
        );
      }
    );
  },
});
