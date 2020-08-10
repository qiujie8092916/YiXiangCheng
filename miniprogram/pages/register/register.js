// miniprogram/pages/register/register.js
import { arrayToJson } from "../../utils/ext";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    name: "",
    company_array: [],
    is_protocol: false,
    company_address: [],
    company_index: [0, 0],
    selected_company: false,
    employment_certificate: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  init() {
    wx.cloud.callFunction({
      name: "getAddress",
      data: {
        isCompany: 1,
      },
      success: (res) => {
        const company_address = res.result.reduce((acc, cur) => {
          const area = cur.addrInfo.area;
          const existIndex = acc.findIndex((it) => it.id === area);

          if (existIndex === -1) {
            acc.push({
              id: cur.addrInfo.area,
              area: cur.addrInfo.area,
              address: [cur.addrInfo],
            });
          } else {
            acc[existIndex].address.push(cur.addrInfo);
          }
          return acc;
        }, []);

        this.setData({
          company_address,
          company_array: [
            company_address.map((it) => it.area),
            company_address[this.data.company_index[0]].address.map(
              (it) => it.name
            ),
          ],
        });
      },
      fail(e) {
        console.log(e);
      },
    });
  },

  handlerName({ detail }) {
    this.setData({
      name: detail.value,
    });
  },

  chooseImg() {
    if (this.data.employment_certificate) {
      wx.previewImage({
        urls: [this.data.employment_certificate],
      });
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: "compressed",
        success: ({ tempFilePaths, tempFiles }) => {
          console.log(tempFilePaths, tempFiles);
          this.setData({
            employment_certificate: tempFilePaths[0],
          });
        },
      });
    }
  },

  checkboxChange() {
    this.setData({
      is_protocol: !this.data.is_protocol,
    });
  },

  changeCompany({ detail }) {
    const company_index = this.data.company_index;

    company_index[detail.column] = detail.value;

    const second_array = this.data.company_address[
      company_index[0]
    ].address.map((it) => it.name);

    if (company_index[1] > second_array.length - 1) {
      company_index[1] = second_array.length - 1;
    }

    this.setData({
      company_index,
      "company_array[1]": second_array,
    });
  },

  submitCompay({ detail }) {
    console.log(detail);
    this.setData({
      selected_company: true,
      company_index: detail.value,
    });
  },
});
