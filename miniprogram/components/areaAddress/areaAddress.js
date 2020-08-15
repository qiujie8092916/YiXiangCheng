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
    defaultValue: {
      type: Object,
    },
    type: String, //pick 一级选择框  company 二级联动选择框
    isError: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    shakeInvalidAnimate: {
      type: Object,
      default: () => ({}),
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: 0,
    range: [],
    dataSource: [],
    isSelected: false,
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
          } else {
            const selectIndex = this.data.dataSource.findIndex(
              (it) => val.id === it.id
            );
            this.setData({
              isSelected: selectIndex !== -1,
              selectIndex: selectIndex !== -1 ? selectIndex : 0,
            });
          }
        }
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
      this.init();
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
          }

          this.setData({
            range,
            dataSource,
          });
        },
        fail(e) {
          console.log(e);
        },
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
