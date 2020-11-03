// miniprogram/pages/orderDetail/orderDetail.js
import {
  bussinessType,
  orderStatusMap,
  CHARTER_LOSS,
  COMMUTE_LOSS,
} from "../../config";
import {
  Order,
  dateFormatYyMmDdHh,
  stampFormatYyMmDdHh,
} from "../../utils/index";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bussinessType,
    biz_type: 0,
    orderStatusMap: orderStatusMap, // 订单状态枚举
    isFetched: false, // 第一次请求数据
    orderDetail: {}, // 订单详情
    driverDetail: {}, // 司机详情
    snapshotDetail: {}, // 快照详情
    watcher: null, // 监听器
    loading: true, // loading
    isloading: true, // 是否要显示loading 第一次进入需要 watch时不需要
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ orderId }) {
    this.orderId = orderId;
    // wx.setNavigationBarTitle({
    //   title: `订单号：${this.orderId}`,
    // });
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
  // onShareAppMessage: function () {},

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
    if (this.data.isloading) {
      wx.showLoading({ title: "加载中" });
    }
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

      orderDetail.use_time_format = dateFormatYyMmDdHh(orderDetail.use_time);

      orderDetail.loss_time =
        new Date(orderDetail.use_time.replace(/-/g, "/")).valueOf() -
        (snapshotDetail.biz_type === bussinessType.charter
          ? CHARTER_LOSS
          : COMMUTE_LOSS);

      orderDetail.loss_time_format = stampFormatYyMmDdHh(orderDetail.loss_time);

      orderDetail.is_loss_time_history =
        orderDetail.loss_time < new Date().getTime();

      orderDetail.order_status_reflection = Object.values(orderStatusMap).find(
        (it) => +it.key === +orderDetail.order_status
      ) || { key: -1, value: "查询中..." };

      if (snapshotDetail.pick_info.province === snapshotDetail.pick_info.city) {
        snapshotDetail.pick_info.province = "";
      }

      if (snapshotDetail.drop_info.province === snapshotDetail.drop_info.city) {
        snapshotDetail.drop_info.province = "";
      }

      if (snapshotDetail.pick_info.province === snapshotDetail.pick_info.city) {
        snapshotDetail.pick_info.province = "";
      }

      if (snapshotDetail.drop_info.province === snapshotDetail.drop_info.city) {
        snapshotDetail.drop_info.province = "";
      }

      this.setData({
        isFetched: true,
        orderDetail,
        driverDetail,
        snapshotDetail,
        loading: false,
        isloading: false,
        biz_type: snapshotDetail.biz_type,
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

  /**
   * 联系司机
   */
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.driverDetail.phone,
    });
  },

  /**
   * 再来一单
   */
  reOrder() {
    if (this.data.biz_type === bussinessType.charter) {
      return wx.navigateTo({
        url: "/pages/charter/charter",
      });
    }
    if (this.data.biz_type === bussinessType.commute) {
      return wx.navigateTo({
        url: "/pages/commute/commute",
      });
    }
  },

  /**
   * 取消订单并重新下单
   */
  cancelOrder() {
    const { orderDetail } = this.data;
    const is_loss = orderDetail.loss_time < new Date().getTime();
    wx.showModal({
      title: "提示",
      showCancel: true,
      confirmText: "想好了",
      cancelText: "我再想想",
      content: is_loss
        ? "超时取消，将扣除订单金额，请确认是否继续取消"
        : "是否需要取消订单？",
      success: async ({ confirm }) => {
        if (confirm) {
          wx.showLoading({ title: "加载中" });
          try {
            const { result = {} } = await wx.cloud.callFunction({
              name: "orderController",
              data: {
                action: "doCancelOrder",
                params: {
                  isLoss: is_loss,
                  orderId: this.orderId,
                },
              },
            });

            console.error(result);

            if (+result.resultCode !== 0) {
              throw result.errMsg;
            }

            wx.hideLoading();
            return wx.showModal({
              showCancel: false,
              title: "提示",
              confirmText: "知道了",
              content: "订单取消成功！",
            });
          } catch (e) {
            wx.hideLoading();
            return wx.showModal({
              showCancel: false,
              title: "提示",
              confirmText: "知道了",
              content: e.toString(),
            });
          }
        }
      },
    });
  },

  // /**
  //  * @description: 发起退款
  //  * @param {type}
  //  * @return {type}
  //  */
  // async queryRefund() {
  //   const { result = {} } = await wx.cloud.callFunction({
  //     name: "orderController",
  //     data: {
  //       action: "queryRefund",
  //       params: {
  //         orderId: this.orderId,
  //       },
  //     },
  //   });

  //   wx.showToast({
  //     title: "请查看控制台",
  //   });
  //   console.log(result);
  // },

  /**
   * @description: 重新支付
   * @param {type}
   * @return {type}
   */
  requestRePayment() {
    Order.invokePay(this.orderId, this.data.snapshotDetail.payment_info)
      .then(() => {
        wx.showToast({
          title: "支付成功",
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {});
  },

  copy() {
    wx.setClipboardData({
      data: this.orderId,
    });
  },
});
