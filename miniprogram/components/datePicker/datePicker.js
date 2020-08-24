// components/datePicker/datePicker.js
import {
  dateFormat,
  nextMonth,
  isSameDay,
  isBefore,
  isAfter,
  joinTime,
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
    curShowDate: "", // 格式化当前选择日期(用来展示 8-13)
    curShowTime: "", // 格式换开始时间(用来展示 12:13)
    curStartDate: "", // 格式化开始日期(2020-8-13 同时是日期picker的默认值)
    curEndDate: "", // 格式化结束日期(2020-9-13)
    curStartTime: "", // 格式化开始时间(12:13)
    curEndTime: "", // 格式化结束时间(12:13)
    timeDefaultValue: "", // 时间默认值(时间picker的默认值)
    selectDate: "", // 选择的日期(2020-8-13)
    selectTime: "", // 选择的时间(12:13)
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
    /**
     * 日期回调
     */
    bindDateChange(e) {
      let _currentDate = e.detail.value,
        _currentTime = this.data.selectTime;

      this.triggerEvent("changeTime", _currentDate + "-" + _currentTime);
      this.setData({
        selectDate: _currentDate,
        curShowDate: dateFormat(_currentDate, "MD"),
      });

      if (isSameDay(_currentDate)) {
        // 已选时间在当前时间之前则重置显示时间/时间默认值/开始时间到当前最新时间
        if (isBefore(joinTime(this.data.curShowTime))) {
          this.setData({
            curShowTime: dateFormat(new Date(), "Hm"),
            timeDefaultValue: dateFormat(new Date(), "Hm"),
            curStartTime: dateFormat(new Date(), "Hm"),
          });
        }
        // 已选时间在当前时间之后则显示时间/时间默认值不动/开始时间到当前最新时间
        if (isAfter(joinTime(this.data.curShowTime))) {
          this.setData({
            curStartTime: dateFormat(new Date(), "Hm"),
          });
        }
      } else {
        // 显示时间不动/开始时间为全时间段/时间默认值为已选时间
        this.setData({
          curStartTime: "",
          timeDefaultValue: this.data.timeDefaultValue,
        });
      }
    },

    /**
     * 时间回调
     */
    bindTimeChange(e) {
      // todo 页面停留时间长仍可选过去时间因开始结束的区间只在组件挂在时确定
      let _currentTime = e.detail.value,
        _currentDate;

      this.setData({
        selectTime: _currentTime,
        curShowTime: _currentTime,
        timeDefaultValue: _currentTime,
      });
      _currentDate = this.data.selectDate;
      this.triggerEvent("changeTime", _currentDate + "-" + _currentTime);
    },

    /**
     * 初始化
     */
    formatDateAndTime() {
      let dateStart = this.properties.dateStart,
        dateEnd = this.properties.dateEnd,
        timeStart = this.properties.timeStart;

      this.setData({
        curShowDate: dateFormat(dateStart, "MD"),
        curStartDate: dateFormat(dateStart, "YMD"),
        curEndDate:
          Object.keys(dateEnd).length === 0
            ? dateFormat(nextMonth(), "YMD")
            : dateFormat(dateEnd, "YMD"),
        curShowTime: dateFormat(timeStart, "Hm"),
        timeDefaultValue: dateFormat(timeStart, "Hm"),
        curStartTime: dateFormat(timeStart, "Hm"),
        selectDate: dateFormat(timeStart, "YMD"),
        selectTime: dateFormat(timeStart, "Hm"),
      });
    },

    /**
     * 切割时间
     */
    splitCurrentDate(date) {
      let temCurDate = date.split("-"),
        currentDate;
      if (temCurDate[1][0] === "0") {
        currentDate =
          temCurDate[0] + "-" + temCurDate[1][1] + "-" + temCurDate[2];
      } else {
        currentDate = date;
      }

      return currentDate;
    },
  },
});
