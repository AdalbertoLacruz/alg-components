// @copyright 2017-2018 adalberto.lacruz@gmail.com

import * as FHtml from '../util/f-html.js';
import { Observable } from './observable.js';

/**
 * Observable with html handling
 *
 * @class
 */
class ObservableEvent extends Observable {
  constructor(name) {
    super(name);

    // The binded to the controller has been processed
    this.binded = false;
  }

  /**
     * Send a custom event on value change, or value objective
     * @param {*} item
     * @param {String} event - name
     * @param {*} to - value to trigger the change (true, a number, ...)
     * @return {ObservableEvent}
     */
  onChangeFireMessage(item, event, to = null) { // TODO: remove?
    if (to == null) {
      this.observe((value) => {
        item.fireMessage(event, this.value);
      });
    } else {
      this.observe((value) => {
        if (value === to) item.fireMessage(event, this.value);
      });
    }
    return this;
  }

  /**
   * Set attribute in a value change
   * Options:
   *   attribute: attribute nama to set
   *   init: true/false To aply reflect inmediatly
   *   type: 'true-false',
   *  ...
   * @param {*} item - Element to set attribute
   * @param {Object} options
   * @return {ObservableEvent}
   */
  onChangeReflectToAttribute(item, options = {}) {
    let { attribute, init, type} = options;
    attribute = attribute || this.name;
    let handler;

    switch (this._type) {
      case 'boolean':
        this.observe(handler = (value) => {
          FHtml.attributeToggle(item, attribute, value, { type });
        });
        // if (this.value != null && init) FHtml.attributeToggle(item, attribute, this.value, { type });
        if (this.value != null && init) handler(this.value);
        break;
      case 'number': // number & string
      case 'string':
        this.observe(handler = (value) => {
          if (value != null) {
            item.setAttribute(attribute, value.toString());
          } else {
            if (item.hasAttribute(attribute)) item.removeAttribute(attribute);
          }
        });
        // if (this.value != null && init) item.setAttribute(attribute, this.value.toString());
        if (init) handler(this.value);
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
