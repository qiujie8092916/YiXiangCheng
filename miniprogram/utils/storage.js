class Storage {
  constructor() {}

  /**
   * @description: 默认缓存3分钟
   * @param {type} key 缓存key
   * @param {type} value 缓存value
   * @param {type} expire 缓存持续时间 默认3分钟
   */
  setStorage(key, value, expire = 3) {
    let storageTime = new Date().getTime(),
      cacheTime = expire * 60 * 1000,
      expireTime = storageTime + cacheTime,
      _value = value + "___" + expireTime;
    wx.setStorageSync(key, _value);
  }

  getStorage(key) {
    let getStorageTime = new Date().getTime(),
      tempStorageInfo = wx.getStorageSync(key) || "",
      splitStorage,
      expireTime;
    if (tempStorageInfo && tempStorageInfo.indexOf("___") !== -1) {
      splitStorage = tempStorageInfo.split("___")[0];
      expireTime = tempStorageInfo.split("___")[1];
      return getStorageTime > expireTime ? "" : JSON.parse(splitStorage);
    } else {
      return "";
    }
  }

  removeStorage(key) {
    wx.removeStorageSync(key);
  }

  removeAllStorage() {
    wx.clearStorage();
  }
}

export default new Storage();
