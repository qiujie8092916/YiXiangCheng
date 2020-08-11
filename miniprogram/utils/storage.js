class Storage {
  constructor() {}

  setStorage(key, value) {
    wx.setStorageSync(key, value);
  }

  getStorage(key) {
    return wx.getStorageSync(key) || "";
  }

  removeStorage(key) {
    wx.removeStorageSync(key);
  }

  removeAllStorage() {
    wx.clearStorage();
  }
}

export default new Storage();
