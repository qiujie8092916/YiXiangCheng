import { observable, action } from "mobx-miniprogram";

const store = observable({
  // 数据字段
  userInfo: {},

  // actions
  updateUserInfo: action(function (userInfo) {
    this.userInfo = userInfo;
  }),
});

export default store;
