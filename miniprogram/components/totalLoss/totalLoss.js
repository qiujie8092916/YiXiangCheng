// components/totalLoss/totalLoss.js
import { stampFormatYyMmDdHh } from "../../utils/ext";
import { bussinessType, CHARTER_LOSS, COMMUTE_LOSS } from "../../config";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 业务类型
     * @type {bussinessType.charter|bussinessType.commute}
     */
    bizType: {
      type: Number,
    },
    /**
     * 用车时间
     * @type {string}
     * @example '2020-10-14 14:31'
     */
    useTime: {
      value: "",
      type: String,
    },
  },

  observers: {
    useTime(newVal) {
      if (newVal) {
        let loss;
        const now = new Date().getTime();
        const use_timestamp = new Date(newVal.replace(/-/g, "/")).valueOf();
        console.log("newVal", newVal);
        console.log("newVal_replace", newVal.replace(/-/g, "/"));
        console.log("use_timestamp", use_timestamp);
        if (this.properties.bizType === bussinessType.charter) {
          loss = use_timestamp - CHARTER_LOSS;
        } else if (this.properties.bizType === bussinessType.commute) {
          loss = use_timestamp - COMMUTE_LOSS;
        }
        console.log("loss", loss);

        this.setData(
          {
            is_history: loss < now,
            time: stampFormatYyMmDdHh(loss),
          },
          () => {
            this.triggerEvent("changeLossTime", {
              time: this.data.time,
              isHistory: this.data.is_history,
            });
          }
        );
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    is_history: false,
    time: "",
  },
});
