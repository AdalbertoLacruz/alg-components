// @copyright 2017 ALG
// @ts-check

import { Observable } from './observable.js';

/**
 * Observable Array
 *
 * @class
 */
class ObservableArray extends Observable {
  /**
   * @param {String} name - variable name
   */
  constructor(name = '') {
    super(name);
    this._value = [];
  }

  /**
   * Prepares the value for display
   * @type {Object}
   */
  get value() {
    return {
      method: 'create',
      index: null,
      data: this._value
    };
  }

  /**
   * We receive a new array
   * @param {Array} value
   */
  set(value) {
    this._value = value;
    this.dispatch(this.value);
  }

  /**
   *
   * @param {*} value
   * @return {ObservableArray}
   */
  init(value) { return this; }

  /**
   *
   * @param {*} value
   * @return {ObservableArray}
   */
  add(value) {
    this._value.push(value);
    this.dispatch({
      method: 'add',
      index: null,
      data: [value]
    });
    return this;
  }

  /**
   *
   * @param {*} value
   * @param {number} index
   * @return {ObservableArray}
   */
  update(value, index) {
    if (index < 0 || index > this._value.length) return;
    this._value[index] = value;
    this.dispatch({
      method: 'update',
      index: [index],
      data: [value]
    });
    return this;
  }

  /**
   *
   * @param {number} index
   * @return {ObservableArray}
   */
  delete(index) {
    if (index < 0 || index > this._value.length) return;
    this._value.splice(index, 1);
    this.dispatch({
      method: 'delete',
      index: [index],
      data: null
    });
    return this;
  }
}

export { ObservableArray };
