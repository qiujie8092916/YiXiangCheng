// miniprogram/pages/orderList/orderList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    loading: true,
    pageIndex: 0,
    pageSize: 20,
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
  onPullDownRefresh: function () {
    this.setData(
      {
        pageIndex: 0,
      },
      () => {
        this.getOrderList();
      }
    );
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData(
      {
        pageIndex: this.data.pageIndex + 1,
      },
      () => {
        this.getOrderList();
      }
    );
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  init() {
    this.getOrderList();
  },

  /**
   * 获取订单列表
   */
  getOrderList: async function () {
    wx.showLoading();
    try {
      const { result = {} } = await wx.cloud.callFunction({
        name: "orderController",
        data: {
          action: "checkOrderList",
          params: {
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize,
          },
        },
      });
      wx.hideLoading();
      if (this.data.pageIndex === 0) {
        this.setData({
          orderList: result.resultData,
        });
      } else {
        this.setData({
          orderList: [...this.data.orderList, ...result.resultData],
        });
      }

      console.log(result);
    } catch (e) {
      return wx.showToast({
        icon: "none",
        title: e.toString(),
      });
    }
  },

  chooseCurOrder(e) {
    let orderId = e.target.dataset.id;
    wx.navigateTo({ url: `/pages/orderDetail/orderDetail?orderId=${orderId}` });
  },
});
