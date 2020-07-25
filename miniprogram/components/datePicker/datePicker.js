// components/datePicker/datePicker.js
import {
  dateFormat,
  nextMonth,
  isSameDay,
  isBefore,
  isAfter,
} from "../../utils/ext";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateStart: {
      type: Object,
      value: new Date(),
    },
    dateEnd: {
      type: Object,
      value: {}, // 默认取当前时间的一个月后
    },
    timeStart: {
      type: Object,
      value: new Date(),
    },
    timeEnd: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    curDefaultDate: "", // 格式化当前选择日期
    curShowTime: "", // 格式换开始时间
    curStartDate: "", // 格式化开始日期
    curEndDate: "", // 格式化结束日期
    curStartTime: "", // 格式化开始时间
    curEndTime: "", // 格式化结束时间
    timeDefaultValue: "", // 时间默认值
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    this.formatDateAndTime();
  },
  ready: function () {},

  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange(e) {
      this.setData({
        curDefaultDate: dateFormat(e.detail.value, "MD"),
      });
      this.triggerEvent("changeDate", e.detail.value);
      if (isSameDay(e.detail.value)) {
        // 已选时间在当前时间之前则重置显示时间/时间默认值/开始时间到当前最新时间
        // todo
        // 已选时间在当前时间之后则显示时间/时间默认值不动/开始时间到当前最新时间
        // todo
      } else {
        // 显示时间不动 开始时间为全时间段 时间默认值为已选时间
        // todo
      }
    },
    bindTimeChange(e) {
      this.setData({
        curShowTime: e.detail.value,
        timeDefaultValue: e.detail.value,
      });
      this.triggerEvent("changeTime", e.detail.value);
    },
    formatDateAndTime() {
      this.setData({
        curDefaultDate: dateFormat(this.properties.dateStart, "MD"),
        curStartDate: dateFormat(this.properties.dateStart, "YMD"),
        curEndDate:
          Object.keys(this.properties.dateEnd).length === 0
            ? dateFormat(nextMonth(), "YMD")
            : dateFormat(this.properties.dateEnd, "YMD"),
        curShowTime: dateFormat(this.properties.timeStart, "Hm"),
        timeDefaultValue: dateFormat(this.properties.timeStart, "Hm"),
        curStartTime: dateFormat(this.properties.timeStart, "Hm"),
      });
    },
  },
});
