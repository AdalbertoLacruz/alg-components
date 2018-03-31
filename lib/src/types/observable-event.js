// @copyright 2017-2018 adalberto.lacruz@gmail.com

import * as FHtml from '../util/f-html.js';
import { Observable } from './observable.js';
import { TYPE_BOOL, TYPE_NUM, TYPE_STRING } from '../util/constants.js';

/**
 * HTML handling for Attributes and Events observables
 *
 * @class
 */
class ObservableEvent extends Observable {
  /**
   * @param {String} name
   */
  constructor(name) {
    super(name);

    // The binded to the controller has been processed
    // this.binded = false; // TODO: deprecated?

    /** @type {String} */
    this.bindedChannel = null; // Channel subscription

    /** @type {*} */
    this.bindedController = null; // AlgController subscription. Also, AlgComponent could act as a controller.

    /** @type {Function} */
    this.receiverHandler = this._receiverHandler.bind(this);
  }

  /**
   * Handler to subscribe to other observables
   * @param {*} received
   */
  _receiverHandler(received) {
    this.update(received);
  }

  /**
     * Send a custom event on value change, or value objective
     * @param {*} item
     * @param {String} event - name
     * @param {*} to - value to trigger the change (true, a number, ...)
     * @return {ObservableEvent}
     */
  onChangeFireMessage(item, event, to = null) { // TODO: deprecated?
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
   *   String attribute: attribute name to set. If null use the observable name
   *   Boolean init: true/false To set now the attribute
   *   String type: Define boolean attributes as 'true-false', '-remove', ...
   *
   * @param {*} element - Element to set attribute
   * @param {Object} options
   * @return {ObservableEvent}
   */
  onChangeReflectToAttribute(element, options = {}) {
    let { attribute, init, type} = options;
    attribute = attribute || this.name;
    let handler;

    switch (this._type) {
      case TYPE_BOOL:
        handler = (value) => { FHtml.attributeToggle(element, attribute, value, { type }); };
        this.observe(handler);
        if (this.value != null && init) handler(this.value);
        break;
      case TYPE_NUM: // number & string
      case TYPE_STRING:
        handler = (value) => {
          if (value != null) {
            const _value = (typeof value === 'string') ? value : value.toString();
            element.setAttribute(attribute, _value);
          } else {
            if (element.hasAttribute(attribute)) element.removeAttribute(attribute);
          }
        };
        this.observe(handler);
        if (init) handler(this.value);
        break;

      default:
        break;
    }
    return this;
  }

  /**
   * Set class in a value change true/false
   * @param {*} element
   * @param {String} className
   * @return {ObservableEvent}
   */
  onChangeReflectToClass(element, className) {
    if (this._type === TYPE_BOOL) {
      this.observe((value) => {
        element.classList.toggle(className, value);
      });
    }
    return this;
  }

  /**
   * Observable value type definition
   *
   * @override
   * @param {String} type
   * @param {Object} options bool useTransformer
   */
  setType(type, options = {}) {
    const useTransformer = (options.useTransformer != null) ? options.useTransformer : true;
    super.setType(type, { useTransformer });
    return this;
  }
}

export { ObservableEvent };
