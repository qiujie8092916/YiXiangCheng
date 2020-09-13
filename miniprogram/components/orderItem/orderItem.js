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
    charterday: {
      type: Number,
      value: 1,
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
    useTime: {
      type: String,
      value: "2020-09-01 09:00",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderStatusMap: {
      1: "待支付",
      2: "待接单",
      3: "已接单",
      4: "已上车",
      5: "已取消",
      6: "已退款",
      7: "已完成",
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
