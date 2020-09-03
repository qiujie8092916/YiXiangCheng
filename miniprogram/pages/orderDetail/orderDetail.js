// miniprogram/pages/orderDetail/orderDetail.js
import { dateFormat } from "../../utils/index";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFetched: false, // 第一次请求数据
    orderDetail: {}, // 订单详情
    driverDetail: {}, // 司机详情
    snapshotDetail: {}, // 快照详情
    watcher: null, // 监听器
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ orderId }) {
    console.log(orderId, "订单id");
    this.orderId = orderId;
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
  onUnload: async function () {
    await this.watcher.close();
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
   * 订单详情(watch默认触发一次 不再需要手动查询)
   */
  checkOrderDetail: function (orderId) {
    wx.cloud
      .callFunction({
        name: "orderController",
        data: {
          action: "createPerpayRequest",
          params: _params,
        },
      })
      .then((res) => {
        console.log(res, "订单详情查询成功");
      })
      .catch((err) => {
        console.log(err, "订单详情查询失败");
      });
  },

  /**
   * 订单详情监听器
   */
  registerWatcher() {
    const db = wx.cloud.database();
    this.watcher = db
      .collection("order_info")
      .where({
        order_no: this.orderId,
      })
      .watch({
        onChange: (snapshot) => {
          console.log(snapshot, "order_info表变化");
          this.queryOrderDetail();
        },
        onError: function (err) {
          console.error(err, "order_info表监听错误");
        },
      });
  },

  /**
   * 监听到订单变化，查询订单详情（init & update）
   */
  async queryOrderDetail() {
    wx.showLoading();
    try {
      const { result = {} } = await wx.cloud.callFunction({
        name: "orderController",
        data: {
          action: "checkOrderDetail",
          params: {
            orderId: this.orderId,
          },
        },
      });
      if (+result.resultCode !== 0) {
        return wx.showToast({
          icon: "none",
          title: result.errMsg,
        });
      }

      console.log(result.resultData);
      const {
        driverDetail,
        snapshotDetail,
        ...orderDetail
      } = result.resultData;

      orderDetail._useTime = dateFormat(
        orderDetail.useTime,
        "YYYY年MM月DD日 HH:mm"
      );

      this.setData({
        isFetched: true,
        orderDetail,
        driverDetail,
        snapshotDetail,
        loading: false,
      });
      wx.hideLoading();
    } catch (e) {
      return wx.showToast({
        icon: "none",
        title: e.toString(),
      });
    }
  },

  /**
   * 初始化
   */
  init() {
    // 注册监听
    this.registerWatcher();
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.driverDetail.phone,
    });
  },

  reOrder() {
    if (this.data.snapshotDetail.biz_type === 1) {
      return wx.navigateTo({
        url: "/pages/charter/charter",
      });
    }
    if (this.data.snapshotDetail.biz_type === 2) {
      return wx.navigateTo({
        url: "/pages/commute/commute",
      });
    }
  },

  cancelOrder() {
    wx.cloud.callFunction({
      name: "orderController",
      data: {
        action: "cancelOrder",
        params: {
          orderId: this.orderId,
        },
      },
    });
  },
});
