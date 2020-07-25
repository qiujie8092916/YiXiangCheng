// components/logoHeader/logoHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowOrder: {
      type: Boolean,
      default: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderCount: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    queryNonCompleteOrderCount() {
      //TODO 获取未完单订单数量
    },

    goOrderList() {
      wx.navigateTo({
        url: "/pages/orderList/orderList",
      });
    },
  },
});
