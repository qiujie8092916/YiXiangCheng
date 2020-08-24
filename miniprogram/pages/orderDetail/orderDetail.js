// miniprogram/pages/orderDetail/orderDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {}, // 订单详情
    watcher: null, // 监听器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.orderId, "订单id");
    this.init(options.orderId);
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
  registerWatcher(orderId) {
    const db = wx.cloud.database();
    this.watcher = db
      .collection("order_info")
      .where({
        order_id: orderId,
      })
      .watch({
        onChange: function (snapshot) {
          console.log(snapshot, "order_info表变化");
        },
        onError: function (err) {
          console.err(err, "order_info表监听错误");
        },
      });
  },

  /**
   * 初始化
   */
  init(orderId) {
    // 注册监听
    this.registerWatcher(orderId);
  },
});
