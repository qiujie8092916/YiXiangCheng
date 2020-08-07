/**
 * @class ResponseStructure
 * @description 支持链式调用
 * @summary RESTful
 */
class ResponseStructure {
  constructor() {
    /**
     * @memberof {any} resultData 返回数据
     * @private
     */
    this.resultData = null;
    /**
     * @memberof {number} resultCode 返回code
     * @private
     */
    this.resultCode = 0;
    /**
     * @memberof {string} errMsg 错误信息
     * @private
     */
    this.errMsg = null;
  }

  /**
   * @param data
   * @public
   * @returns {ResponseStructure}
   */
  success(data) {
    this.resultData = data;
    return this;
  }

  /**
   * @param {string|number} code
   * @param {string} err
   * @public
   * @returns {ResponseStructure}
   */
  error(code, err) {
    this.resultCode = parseInt(code);
    this.errMsg = err;
    return this;
  }

  /**
   * @public
   * @returns {{resultData: null, errMsg: null, resultCode: number}}
   */
  get() {
    return {
      errMsg: this.errMsg,
      resultCode: this.resultCode,
      resultData: this.resultData,
    };
  }
}

module.exports = ResponseStructure;
