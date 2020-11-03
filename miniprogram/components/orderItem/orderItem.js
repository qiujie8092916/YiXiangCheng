// components/orderItem/orderItem.js
import { orderStatusMap } from "../../config";

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
    createTime: {
      type: String,
      value: "2020-09-01 09:00", //下单时间
    },
  },

  observers: {
    status(val) {
      if (val) {
        const orderStatusReflection = Object.values(orderStatusMap).find(
          (it) => {
            return it.key === val;
          }
        );

        console.log(orderStatusReflection);

        this.setData({
          orderStatusReflection,
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderStatusMap: orderStatusMap,
    orderStatusReflection: {},
    travelType: {
      charter: "享定制",
      commute: "享出发",
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
