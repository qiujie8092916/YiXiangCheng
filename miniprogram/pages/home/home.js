// miniprogram/pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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

  goBizBooking({ currentTarget }) {
    const { biz } = currentTarget.dataset;

    if (biz === "charter") {
      return wx.navigateTo({ url: "/pages/charter/charter" });
    } else if (biz === "commute") {
      wx.showLoading({ title: "加载中" });
      wx.cloud.callFunction({
        name: "userControl",
        data: {
          action: "isRegisterCommute",
        },
        success: ({ result = {} }) => {
          if (+result.resultCode !== 0) {
            console.error(result.errMsg);
            wx.hideLoading();
            return wx.showToast({
              icon: "none",
              title: result.errMsg || "异常错误",
            });
          }

          return wx.navigateTo({ url: result.resultData });
        },
        fail(e) {
          console.error(e);
          wx.hideLoading();
          return wx.showToast({
            icon: "none",
            title: JSON.stringify(e),
          });
        },
        complete: wx.hideLoading,
      });
    }
  },
});
