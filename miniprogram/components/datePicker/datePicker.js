// components/datePicker/datePicker.js
import { dateFormat } from "../../utils/ext";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateDefault: {
      type: String, // 应改为时间
      value: dateFormat(new Date(), "MD"),
    },
    dateStart: {
      type: String,
      value: dateFormat(new Date(), "YMD"),
    },
    dateEnd: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},

  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange(e) {
      this.triggerEvent("changeDate", e.detail.value);
    },
  },
});
