// miniprogram/pages/register/register.js
import { arrayToJson } from "../../utils/ext";
import { bussinessType, subscribeMessageIds } from "../../config";
import { Storage } from "../../utils/index";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    // 公司地址id
    companyObj: {},
    // 错误项
    error_field: null,
    // 是否勾选免责声明
    is_protocol: false,
    // 必填项提示动画
    shakeInvalidAnimate: {},
    // 工作证明临时文件地址
    employment_certificate: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCloudUserInfo();
    this.createAnimation();
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
  // onShareAppMessage: function () {},

  goPrototol() {
    wx.navigateTo({
      url: "/pages/protocol/protocol",
    });
  },

  /**
   * 获取手机号
   */
  getPhoneNumber(e) {
    wx.cloud
      .callFunction({
        name: "userController",
        data: {
          action: "getCellphone",
          id: e.detail.cloudID,
        },
      })
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  createAnimation() {
    this.animate = wx.createAnimation({
      delay: 0,
      duration: 35,
      timingFunction: "ease",
    });
  },

  handlerName({ detail }) {
    this.setData({
      name: detail.value,
    });
  },

  chooseImg() {
    // if (this.data.employment_certificate) {
    //   wx.previewImage({
    //     urls: [this.data.employment_certificate],
    //   });
    // } else {
    wx.chooseImage({
      count: 1,
      sizeType: "compressed",
      success: ({ tempFilePaths, tempFiles }) => {
        console.log(tempFilePaths, tempFiles);
        this.setData({
          employment_certificate: tempFiles[0],
        });
      },
    });
    // }
  },

  checkboxChange() {
    this.setData({
      is_protocol: !this.data.is_protocol,
    });
  },

  submitCompay({ detail }) {
    this.setData({
      companyObj: detail,
    });
  },

  preSubmit() {
    const animate = this.animate;
    animate
      .translateX(-5)
      .step()
      .translateX(4)
      .step()
      .translateX(-3)
      .step()
      .translateX(2)
      .step()
      .translateX(-1)
      .step()
      .translateX(0)
      .step();

    if (!this.data.phone) {
      this.setData({
        error_field: "phone",
        ["shakeInvalidAnimate.phone"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完善手机号",
      });
      return false;
    }

    if (!this.data.name) {
      this.setData({
        error_field: "name",
        ["shakeInvalidAnimate.name"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完善姓名",
      });
      return false;
    }

    if (!this.data.companyObj.id) {
      this.setData({
        error_field: "company",
        ["shakeInvalidAnimate.company"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完善公司信息",
      });
      return false;
    }

    if (!Object.keys(this.data.employment_certificate).length) {
      this.setData({
        error_field: "certificate",
        ["shakeInvalidAnimate.certificate"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请完善工作证明",
      });
      return false;
    }

    if (!this.data.is_protocol) {
      this.setData({
        error_field: "protocol",
        ["shakeInvalidAnimate.protocol"]: animate.export(),
      });
      wx.showToast({
        icon: "none",
        title: "请勾选免责声明",
      });
      return false;
    }

    return true;
  },

  /**
   * 订阅
   */
  registerSubscribe() {
    return new Promise((resolve) => {
      wx.requestSubscribeMessage({
        tmplIds: [subscribeMessageIds.registerId],
        success: (res) => {
          if (res[subscribeMessageIds.registerId] === "accept") {
            console.log("订阅成功");
            resolve(true);
          } else {
            console.log("用户不订阅");
            resolve(false);
          }
        },
        fail: ({ errCode, errMsg }) => {
          console.log("订阅接口失败");
          console.error(errCode, errMsg);
          resolve(false);
        },
      });
    });
  },

  /**
   * 通勤注册
   */
  commuteRegister({ fileId, isSubscribe }) {
    wx.cloud.callFunction({
      name: "userController",
      data: {
        action: "doRegisterCommute",
        fileId,
        isSubscribe,
        phone: this.data.phone,
        name: this.data.name.trim(),
        company: this.data.companyObj.id,
      },
      success: ({ result = {} }) => {
        wx.hideLoading({
          complete: () => {
            if (+result.resultCode !== 0) {
              console.error(result.errMsg);
              return wx.showToast({
                icon: "none",
                title: result.errMsg || "异常错误",
              });
            }
            wx.showModal({
              showCancel: false,
              content: "提交成功，等待审核",
              success: ({ confirm }) => {
                wx.navigateTo({
                  url: "/pages/home/home",
                });
              },
            });
          },
        });
      },
      fail(e) {
        console.error(e);
        wx.showToast({
          icon: "none",
          title: JSON.stringify(e),
        });
      },
      complete: wx.hideLoading,
    });
  },

  /**
   * 上传图片
   */
  uploadImage() {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: `employmentCertificate/${
          this.data.employment_certificate.path.match(
            new RegExp("[^/]+(?!.*/)")
          )[0]
        }`,
        filePath: this.data.employment_certificate.path,
        success: ({ fileID }) => {
          resolve(fileID);
        },
        fail: ({ errMsg }) => {
          reject(errMsg);
        },
      });
    });
  },

  /**
   * 提交注册
   */
  async onsubmit({ detail: { value } }) {
    // 校验字段
    if (!this.preSubmit()) return;

    // 获取订阅状态
    const isSubscribe = await this.registerSubscribe();
    console.log("isSubscribe", isSubscribe);
    wx.showLoading({ title: "加载中" });

    //上传图片
    try {
      const fileId = await this.uploadImage();
      this.commuteRegister({ fileId, isSubscribe });
    } catch (e) {
      wx.hideLoading({
        complete() {
          wx.showToast({
            icon: "none",
            title: e,
          });
        },
      });
    }
  },

  /**
   * 获取用户信息
   */
  getCloudUserInfo() {
    const userInfo = Storage.getStorage("userInfo");

    if (userInfo && userInfo.user_phone) {
      // 已经注册过无需再授权
      this.setData({
        phone: userInfo.user_phone,
      });
    } else {
      wx.cloud
        .callFunction({
          name: "userController",
          data: {
            action: "getUserInfo",
          },
        })
        .then((res) => {
          if (res && res.result && res.result.resultData) {
            this.setData({
              phone: res.result.resultData.user_phone,
            });
            Storage.setStorage(
              "userInfo",
              JSON.stringify(res.result.resultData)
            );
          } else {
            console.log("当前用户未注册");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
});
