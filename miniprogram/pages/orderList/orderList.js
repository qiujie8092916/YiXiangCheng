// miniprogram/pages/orderList/orderList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    loading: true,
    rows: 0, // 总条数
    pageIndex: 0,
    pageSize: 5,
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
      async () => {
        await this.getOrderList();
        wx.stopPullDownRefresh();
      }
    );
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const newPageIndex = this.data.pageIndex + 1;

    if (Math.ceil(this.data.rows / this.data.pageSize) <= newPageIndex) return;

    this.setData(
      {
        pageIndex: newPageIndex,
      },
      () => {
        this.getOrderList();
      }
    );
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {},

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

      if (+result.resultCode !== 0) {
        return wx.showToast({
          icon: "none",
          title: result.errMsg,
        });
      }

      console.log(result);
      const { rows, data } = result.resultData;

      this.setData({
        rows,
        orderList:
          this.data.pageIndex === 0 ? data : [...this.data.orderList, ...data],
      });
      return await Promise.resolve();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: e.toString(),
      });
      return await Promise.resolve();
    }
  },

  chooseCurOrder(e) {
    let orderId = e.target.dataset.id;
    wx.navigateTo({ url: `/pages/orderDetail/orderDetail?orderId=${orderId}` });
  },
});
