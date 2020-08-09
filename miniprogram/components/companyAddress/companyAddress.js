// components/companyAddress/companyAddress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** 不禁用的时候显示 园区 | 地址名称
     * 禁用的时候显示 园区 | 地址名称
     *              详细地址
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * @property {string} name 地址名称
     * @property {string} address 详细地址
     * @property {string} area 园区
     */
    address: {
      type: Object,
      default: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
});
