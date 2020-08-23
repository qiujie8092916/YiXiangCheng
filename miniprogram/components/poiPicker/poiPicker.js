// components/poiPicker/poiPicker.js
import { poiConfig } from "../../config";
const chooseLocation = requirePlugin("chooseLocation");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: "chakantiezidingwei",
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    type: {
      type: String,
      value: "departure", // departure 出发地 destination 目的地
    },
    isError: {
      type: Boolean,
      value: false,
    },
    shakeInvalidAnimate: {
      type: Object,
      value: () => ({}),
    },
    /**
     * @brief 是否显示 (false: 可能挂载了但是hidden了)
     */
    isShow: {
      type: Boolean,
      value: true,
    },
    /**
     * @type {DataSource}
     * @typedef {object} DataSource
     * @property {0} DataSource.id
     * @property {string} DataSource.address
     * @property {string} DataSource.area
     * @property {string} DataSource.city
     * @property {array} DataSource.coordinates - [longitude, latitude]
     * @property {string} DataSource.district
     * @property {string} DataSource.name
     * @property {string} DataSource.province
     */
    defaultValue: {
      type: Object,
      value: {},
    },
  },

  observers: {
    type: function (val) {
      if (val === "destination") {
        this.setData({
          poi: "您在哪儿下车？",
        });
      } else {
        this.setData({
          poi: "您在哪儿上车？",
        });
      }
    },
    defaultValue(val) {
      if (Object.keys(val).length) {
        this.setData({
          poi: val.name,
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    poi: "您在哪儿上车？",
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {
      chooseLocation.setLocation(null);
    },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      const location = chooseLocation.getLocation();

      if (location && this.properties.isShow) {
        this.setData({
          poi: location.name,
        });
        this.triggerEvent("choosePoi", location);
      }
    },
    hide: function () {},
    resize: function () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 地图选点
    choosePoi() {
      const key = poiConfig.key;
      const referer = poiConfig.referer;

      wx.navigateTo({
        url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`,
      });
    },
  },
});
