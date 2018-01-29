// @copyright 2017-2018 adalberto.lacruz@gmail.com

export class ValidatorManager {
  /**
   * Validator storage
   * @type {Map<String, Function>}
   */
  static get register() { return this._register || (this._register = new Map()); }

  /**
   * Defines a validator
   * @param {String} name
   * @param {Function} handler
   */
  static define(name, handler) {
    this.register.set(name, handler);
  }

  /**
   * Recovers a validator
   * @param {String} name
   */
  static getValidator(name) {
    return this.register.get(name);
  }
};
