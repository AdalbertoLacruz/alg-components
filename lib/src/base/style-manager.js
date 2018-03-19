// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from './alg-component.js';
import { ObservableEvent } from '../types/observable-event.js';
import { TYPE_STRING } from '../util/constants.js';

/**
 * Style bindings for the component
 */
class StyleManager {
  /**
   * @param {AlgComponent} target
   */
  constructor(target) {
    /** @type {AlgComponent} */
    this.target = target; // Element to set styles

    /** @type {Map<String, ObservableEvent>} */
    this.register = new Map(); // Style storage { property: observable }
  }

  // /**
  //  * Style storage { property: observable }
  //  * @type {Map<String, ObservableEvent>}
  //  */
  // get register() { return this._register || (this._register = new Map()); }

  /**
   * Compose the name prefix
   * @return {String}
   */
  calculatePrefix() {
    const id = this.target.id ? this.target.id : this.target.tagName;
    return `${id}_${this.target.hash}<style>`;
  }

  /**
   * Define a new property observable
   * @param {String} name
   * @return {ObservableEvent}
   */
  define(name) {
    const entry = new ObservableEvent(name)
      .setType(TYPE_STRING)
      .observe((value) => { this.target.style[name] = value; });
    entry.prefix = this.calculatePrefix();

    this.register.set(name, entry);
    return entry;
  }

  /**
   * For each entry, unsubscribe from the controller
   * @return {StyleManager}
   */
  unsubscribe() {
    this.register.forEach((entry, name) => {
      if (entry.bindedController != null) {
        entry.bindedController.unsubscribe(entry.bindedChannel, entry.receiverHandler);
        entry.bindedController = null;
      }
    });
    return this;
  }
}

export { StyleManager };
