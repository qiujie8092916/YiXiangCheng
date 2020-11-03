// components/calendarPicker/calendarPicker.js
import {
  bussinessType,
  CHARTER_USER_TIME_DURATION,
  COMMUTE_USER_TIME_DURATION,
} from "../../config";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // start: {
    //   type: Number,
    //   value: new Date().getTime() + 2 * 60 * 60 * 1000,
    // },
    // end: {
    //   type: Number,
    //   value: new Date().getTime() + 24 * 60 * 60 * 1000 * 90,
    // },
    bizType: {
      type: Number,
    },
    step: {
      type: Number,
      value: 10,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    start: 0,
    end: 0,
    oneday: 24 * 60 * 60 * 1000,
    MutileArray: [[], [], []],
    MutileIdx: [0, 0, 0],
    MutileArrayYears: [],
    MutileArrayDays: [],
    showText: "请选择出发时间",
    time: "",
  },

  observers: {
    bizType: function (val) {
      const now = new Date().getTime();
      if (val === bussinessType.charter) {
        this.setData({
          start: now + CHARTER_USER_TIME_DURATION[0], // 1603202208147
          end: now + CHARTER_USER_TIME_DURATION[1],
        });
      } else if (val === bussinessType.commute) {
        this.setData({
          start: now + COMMUTE_USER_TIME_DURATION[0],
          end: now + COMMUTE_USER_TIME_DURATION[1],
        });
      }
    },
    "MutileIdx[0]": function (val) {
      let second = this.data.MutileArray[1][this.data.MutileIdx[1]]; // 原第二列值
      let newMutiSecond = this.collectMutiSecond(val); // 新的第二列数据
      let newSecondIdx = newMutiSecond.findIndex((sec) => {
        return sec === second;
      }); // 原第二列数据应在新第二列数据中的索引
      this.setData({
        "MutileArray[1]": newMutiSecond,
        "MutileIdx[1]": newSecondIdx > -1 ? newSecondIdx : 0,
      });
    },
    "MutileIdx[1]": function (val) {
      let third = this.data.MutileArray[2][this.data.MutileIdx[2]]; // 原第三列值
      let newMutiThird = this.collectMutiThird(val); // 新的第三列数据
      let newThirdIdx = newMutiThird.findIndex((thi) => {
        return thi === third;
      }); // 原第三列数据应在新第三列数据中的索引
      this.setData({
        "MutileArray[2]": newMutiThird,
        "MutileIdx[2]": newThirdIdx > -1 ? newThirdIdx : 0,
      });
    },
    "MutileIdx[2]": function (val) {},
  },

  attached: function () {
    this.initCalendar();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @description: value改变
     */
    bindMultiPickerChange(e) {
      let {
          MutileArray,
          MutileIdx,
          MutileArrayYears,
          MutileArrayDays,
        } = this.data,
        _time =
          MutileArray[0][MutileIdx[0]] +
          " " +
          MutileArray[1][MutileIdx[1]] +
          ":" +
          MutileArray[2][MutileIdx[2]];
      this.setData(
        {
          time: _time,
        },
        () => {
          let _chose =
            MutileArrayYears[MutileIdx[0]] +
            "-" +
            this.zeroMd(MutileArrayDays[MutileIdx[0]]) +
            " " +
            MutileArray[1][MutileIdx[1]] +
            ":" +
            MutileArray[2][MutileIdx[2]];

          console.log("选择时间", _chose);
          this.triggerEvent("calendarChange", _chose);
        }
      );
    },

    /**
     * @description: 1-1 to 01-01
     * @param {*}
     * @return {*}
     */
    zeroMd(md) {
      let _md = md.split("-");
      let _m = parseInt(_md[0]) > 10 ? _md[0] : "0" + _md[0];
      let _d = parseInt(_md[1]) > 10 ? _md[1] : "0" + _md[1];

      return _m + "-" + _d;
    },

    /**
     * @description: 列改变
     */
    bindMultiPickerColumnChange(e) {
      let { column, value } = e.detail;

      if (column === 0) {
        this.setData({
          "MutileIdx[0]": value,
        });
      } else if (column === 1) {
        this.setData({
          "MutileIdx[1]": value,
        });
      } else {
        this.setData({
          "MutileIdx[2]": value,
        });
      }
    },

    /**
     * @description: init时间
     */
    initCalendar(first = 0, second = 0, third = 0) {
      this.setData({
        MutileArray: [
          this.collectMutiFirst(first),
          this.collectMutiSecond(second),
          this.collectMutiThird(third),
        ],
      });
    },

    /**
     * @description: 收集第一列数据
     * @return {Array} multiArrayFirst
     */
    collectMutiFirst(Idx = 0) {
      let { start, end } = this.data,
        { step } = this.properties,
        { oneday } = this.data,
        multiArrayFirst = [], // picker第一列数据
        oneItem, // 10月14日周三
        YearInfo = [],
        DayInfo = [],
        D = new Date(start).getDate(),
        days = Math.round((end - start) / oneday),
        i = 0;

      if (new Date(start + step * 60000).getDate() !== D) {
        i = 1;
      }

      for (i; i < days; i++) {
        oneItem = start + i * oneday;
        multiArrayFirst.push(this.formatOneDayInfo(oneItem, i));
        YearInfo.push(this.formatYearInfo(oneItem));
        DayInfo.push(this.formatDayInfo(oneItem));
      }

      this.setData({
        MutileArrayYears: YearInfo,
        MutileArrayDays: DayInfo,
      });

      return multiArrayFirst;
    },

    /**
     * @description: 收集第二列数据
     * @return {Array} multiArraySecond
     */
    collectMutiSecond(Idx = 0) {
      let range = [],
        { start, step } = this.data,
        H = new Date(start + step * 60000).getHours(),
        // M = new Date().getMinutes(),
        multiArraySecond = [],
        idx;

      for (let i = 0; i < 24; i++) {
        let _i = i < 10 ? "0" + i : i;
        range.push(_i);
      }

      if (Idx === 0) {
        idx = range.findIndex((h) => parseInt(h) === H);

        // 59 - M > step
        //   ? (multiArraySecond = range.slice(idx))
        //   : (multiArraySecond = range.slice(idx + 1));

        multiArraySecond = range.slice(idx);
      } else {
        multiArraySecond = range;
      }

      return multiArraySecond;
    },

    /**
     * @description: 收集第三列数据
     * @return {Array} multiArrayThird
     */
    collectMutiThird(Idx = 0) {
      let { step } = this.properties,
        firstIdx = this.data.MutileIdx[0],
        M = new Date().getMinutes(),
        multiArrayThird = [],
        range = [],
        length = 60 / step,
        idx = Math.round(M / step);

      for (let i = 0; i < length; i++) {
        let _i = i * step < 10 ? "0" + i * step : i * step;
        range.push(_i);
      }

      if (Idx === 0 && firstIdx === 0) {
        idx === 0 || M >= parseInt(range[idx]) ? idx++ : idx;

        idx < range.length
          ? (multiArrayThird = range.slice(idx))
          : (multiArrayThird = range);
      } else {
        multiArrayThird = range;
      }

      return multiArrayThird;
    },

    /**
     * @description: 格式化显示的日期 11月16 周五
     */
    formatOneDayInfo(stamp, idx) {
      let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        M = new Date(stamp).getMonth() + 1,
        D = new Date(stamp).getDate(),
        W = weekday[new Date(stamp).getDay()],
        today = new Date().getDate() === D;

      return idx === 0 && today
        ? M + "月" + D + "日" + " " + "今天"
        : M + "月" + D + "日" + " " + W;
    },

    /**
     * @description: 年份 用以拼接入库时间
     */
    formatYearInfo(stamp) {
      let Y = new Date(stamp).getFullYear();
      return Y;
    },

    /**
     * @description: 月份+天 用以拼接入库时间
     */
    formatDayInfo(stamp) {
      let M = new Date(stamp).getMonth() + 1,
        D = new Date(stamp).getDate();
      return M + "-" + D;
    },
  },
});
