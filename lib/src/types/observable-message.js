// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgController } from '../../controller/alg-controller.js';
import { Observable } from './observable.js';

/**
 * Each message definition for on-event=[[controller:channel]]
 * @class
 */
class ObservableMessage extends Observable {
  /** @constructor */
  constructor(name) {
    super(name);

    /** @type {String} */
    this.channel = null;

    /** @type {Object} */
    this.controllerHandler = null;

    // Last value received when delayed == true
    this.delayedValue = null;

    /**
     * True, let send two equal messages
     * @type {Boolean}
     */
    this.letRepeat = false;

    /**
     * true, use AttributeManager, same name. String = name to AttributeManager
     * @type {Boolean | String}
     */
    this.toAttribute = null;

    /**
     * true, use EventManager, same name. String = name to EventManager
     * @type {Boolean | String}
     */
    this.toEvent = null;

    /**
     * Trigger level calculate function to fire the message
     * @type {Function}
     */
    this.trigger = null;

    // Same effect as attribute on-event= ...
    this.isPreBinded = false;
  }

  /**
   * Stop messages in true, until false. Then update with the last delayed value received.
   * Used to avoid bumping (toggle-button).
   * @type {Boolean}
   */
  get delayed() { return this._delayed || (this._delayed = false); }
  set delayed(value) {
    this._delayed = value;
    if (value === false && this.delayedValue != null) {
      const delayedValue = this.delayedValue;
      this.delayedValue = null;
      this.update(delayedValue);
    }
  }

  /**
   * @param  {*} value
   * @param  {Object} options
   * @return {ObservableMessage}
   */
  update(value, options = {}) { // TODO: filter some messages
    if (this.disabled) return this;
    if (this.delayed) {
      this.delayedValue = value;
      return this;
    }

    this.value = value; // could use transformer
    const isTrigger = this.trigger ? this.trigger(this.value) : true;
    if (isTrigger && (this.letRepeat || this.isNewValue)) {
      this.dispatch();

      if (this.controllerHandler && this.channel) {
        this.controllerHandler.fire(this.channel, this.value); // this.value yet transformed
      }
    }

    return this;
  }
}

export { ObservableMessage };
