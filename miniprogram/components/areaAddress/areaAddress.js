// components/areaAddress/areaAddress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
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
    range: [],
    dataSource: [],
    isSelected: false,
    selectIndex: [0, 0],
  },

  pageLifetimes: {
    show() {
      this.init();
    },
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
          const dataSource = (result || []).reduce((acc, cur) => {
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

          this.setData({
            dataSource,
            range: [
              dataSource.map((it) => it.area),
              dataSource[this.data.selectIndex[0]].address.map((it) => it.name),
            ],
          });
        },
        fail(e) {
          console.log(e);
        },
      });
    },

    change({ detail }) {
      this.setData({
        isSelected: true,
        selectIndex: detail.value,
      });
      this.triggerEvent(
        "change",
        this.data.dataSource[detail.value[0]].address[detail.value[1]].id
      );
    },

    columnchange({ detail }) {
      if (detail.column === 0) {
        this.setData({
          // selectIndex,
          "range[1]": this.data.dataSource[detail.value].address.map(
            (it) => it.name
          ),
        });
      }
    },
  },
});
