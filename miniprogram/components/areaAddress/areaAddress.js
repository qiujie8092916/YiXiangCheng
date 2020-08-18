// components/areaAddress/areaAddress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: String,
      value: "0rpx",
    },
    /**
     * @type {DataSource}
     * @typedef {object} DataSource
     * @property {string} DataSource.address
     * @property {string} DataSource.area
     * @property {string} DataSource.city
     * @property {array} DataSource.coordinates - [longitude, latitude]
     * @property {string} DataSource.district
     * @property {string} DataSource.id
     * @property {string} DataSource.name
     * @property {string} DataSource.province
     */
    defaultValue: {
      type: Object,
    },
    /**
     * @brief 是否显示 (false: 可能挂载了但是hidden了)
     */
    isShow: {
      type: Boolean,
      value: true,
    },
    type: String, // pick 一级选择框  company 二级联动选择框
    isError: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: "",
    },
    shakeInvalidAnimate: {
      type: Object,
      value: () => ({}),
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * @desc 下拉框的需要的数据内容
     */
    range: [],
    /**
     * @desc 维护的数据源
     * @type {Array<DataSource>}
     */
    dataSource: [],
    /**
     * @desc 是否初始化过
     * @type boolean
     * @default false
     */
    isInited: false,
    /**
     * @desc 是否选择了
     * @type boolean
     * @default false
     */
    isSelected: false,
    /**
     * @desc 选择的索引
     * @type {number|Array<number>}
     * @default null
     */
    selectIndex: null,
  },

  observers: {
    type(val) {
      if (val === "company") {
        this.setData({
          selectIndex: [0, 0],
        });
      } else {
        this.setData({
          selectIndex: 0,
        });
      }
    },
    defaultValue(val) {
      if (val) {
        if (this.data.dataSource.length) {
          if (this.properties.type === "company") {
            const selectIndex = this.data.dataSource.reduce((acc, cur, idx) => {
              const child_idx = cur.address.findIndex(
                (addr) => addr.id === val.id
              );
              if (child_idx !== -1) {
                acc[0] = idx;
                acc[1] = child_idx;
              }
              return acc;
            }, []);
            this.setData({
              isSelected: selectIndex.length,
              selectIndex: selectIndex.length ? selectIndex : [0, 0],
            });
          } else if (this.properties.type === "pick" && this.data.dataSource.length) {
            this.setSelectIndex(this.data.dataSource)
          }
        }
      }
    },
    isShow(val) {
      // isShow为true && defaultValue为空时初始化
      if(val && !this.data.isInited) {
        this.init();
      }
    },
  },

  lifetimes: {
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      // this.init();
    },
    hide: function () {},
    resize: function () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      wx.cloud.callFunction({
        name: "getAddress",
        data:
          this.properties.type === "company"
            ? {
                isCompany: 1,
              }
            : this.properties.type === "pick"
            ? {
                isPick: 1,
              }
            : {},
        success: ({ result }) => {
          let range = [],
            dataSource = [];
          if (this.properties.type === "company") {
            dataSource = (result || []).reduce((acc, cur) => {
              const area = cur.addrInfo.area,
                existIndex = acc.findIndex((it) => it.id === area),
                addrInfo = {
                  id: cur.id,
                  ...cur.addrInfo,
                };

              if (existIndex === -1) {
                acc.push({
                  id: cur.addrInfo.area,
                  area: cur.addrInfo.area,
                  address: [addrInfo],
                });
              } else {
                acc[existIndex].address.push(addrInfo);
              }
              return acc;
            }, []);
            range = [
              dataSource.map((it) => it.area),
              dataSource[this.data.selectIndex[0]].address.map((it) => it.name),
            ];
          } else if (this.properties.type === "pick") {
            dataSource = (result || []).map((it) => ({
              id: it.id,
              ...it.addrInfo,
            }));
            range = dataSource.map((it) => it.name);
            this.setSelectIndex(dataSource)
          }

          this.setData({
            range,
            dataSource,
            isInited: true,
          });
        },
        fail(e) {
          console.log(e);
        },
      });
    },

    setSelectIndex(dataSource) {
      const selectIndex = dataSource.findIndex(
          (it) => this.properties.defaultValue.id === it.id
      );
      this.setData({
        isSelected: selectIndex !== -1,
        selectIndex: selectIndex !== -1 ? selectIndex : 0,
      });
    },

    change({ detail }) {
      const selectIndex =
        this.properties.type === "company"
          ? detail.value
          : parseInt(detail.value);
      this.setData({
        selectIndex,
        isSelected: true,
      });
      this.triggerEvent(
        "change",
        this.properties.type === "company"
          ? this.data.dataSource[selectIndex[0]].address[selectIndex[1]]
          : this.data.dataSource[selectIndex]
      );
    },

    columnchange({ detail }) {
      if (detail.column === 0) {
        this.setData({
          "range[1]": this.data.dataSource[detail.value].address.map(
            (it) => it.name
          ),
        });
      }
    },
  },
});
