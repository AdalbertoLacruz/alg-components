// @copyright 2017 ALG
// @ts-check

import * as FHtml from '../util/f-html.js';
import { Observable } from './observable.js';

/**
 * Observable with html handling
 *
 * @class
 */
class ObservableEvent extends Observable {
  /**
     * Send a custom event on value change, or value objective
     * @param {*} item
     * @param {String} event - name
     * @param {*} to - value to trigger the change (true, a number, ...)
     * @return {ObservableEvent}
     */
  onChangeFireMessage(item, event, to = null) {
    if (to == null) {
      this.observe((value) => {
        item.fire(event, this.value);
      });
    } else {
      this.observe((value) => {
        if (value === to) item.fire(event, this.value);
      });
    }
    return this;
  }

  /**
   * Set attribute in a value change
   * Options:
   *   attribute: attribute nama to set
   *   type: 'true-false', ...
   * @param {*} item - Element to set attribute
   * @param {Object} options
   * @return {ObservableEvent}
   */
  onChangeReflectToAttribute(item, options = {}) {
    const attrName = options.attribute || this.name;
    switch (this._type) {
      case 'boolean':
        this.observe((value) => {
          FHtml.attributeToggle(item, attrName, value, options);
        });
        if (this.value != null) FHtml.attributeToggle(item, attrName, this.value, options);
        break;
      case 'number':
      case 'string':
        this.observe((value) => {
          item.setAttribute(attrName, value.toString());
        });
        if (this.value != null) item.setAttribute(attrName, this.value.toString());
        break;

      default:
        break;
    }
    return this;
  }

  /**
   * Set class in a value change true/false
   * @param {*} item
   * @param {String} className
   * @return {ObservableEvent}
   */
  onChangeReflectToClass(item, className) {
    if (this._type === 'boolean') {
      this.observe((value) => {
        item.classList.toggle(className, value);
      });
    }

    return this;
  }
}

export { ObservableEvent };