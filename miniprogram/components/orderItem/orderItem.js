// components/orderItem/orderItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Number,
      value: 0,
    },
    money: {
      type: Number,
      value: 200,
    },
    type: {
      type: String,
      value: "charter",
    },
    chartertime: {
      type: Number,
      value: 8,
    },
    charterdepart: {
      type: String,
      value: "包车出发地",
    },
    commutedepart: {
      type: String,
      value: "通勤出发地",
    },
    commutedestination: {
      type: String,
      value: "通勤目的地",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderStatusMap: {
      0: "待支付",
      1: "已完成",
      2: "已取消",
    },
    travelType: {
      charter: "包车",
      commute: "通勤用车",
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseCurOrder() {
      this.triggerEvent("chooseOrder");
    },
  },
});
