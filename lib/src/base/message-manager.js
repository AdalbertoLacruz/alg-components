// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../base/alg-component.js';
import { AlgController } from '../../controller/alg-controller.js';
import { ObservableMessage } from '../types/observable-message.js';

/**
 * Manager for the component messages emited to the bus
 * @class
 */
class MessageManager {
  /**
   * @param {AlgComponent} target
   */
  constructor(target) {
    this.target = target;

    /** @type {ObservableMessage} */
    this.entry = null; // Cache for Last defined

    /** @type {Map<String, ObservableMessage>} */
    this.register = new Map(); // Messages storage
  }

  // /**
  //  * Messages storage
  //  * @type {Map<String, ObservableMessage>}
  //  */
  // get register() { return this._register || (this._register = new Map()); }

  /**
   * Compose the name prefix
   * @return {String}
   */
  calculatePrefix() {
    const id = this.target.id ? this.target.id : this.target.tagName;
    return `${id}_${this.target.hash}<msg>`;
  }

  /**
   * Defines a message.
   *
   * options:
   *   isPrebinded - Boolean, attribute on-name predefined
   *   letRepeat - Boolean, Could send same message as previous to the bus
   *   toAttribute - Boolean true/String name
   *   toEvent - Boolean true/String name
   *
   * @param {String} name messageName
   * @param {Object} options
   * @return {MessageManager} this.entry has the definded message
   */
  define(name, options = {}) {
    const {isPreBinded, letRepeat, toAttribute, toEvent} = options;
    const register = this.register;

    if (register.has(name)) {
      this.entry = register.get(name);
    } else {
      let entry = this.entry = new ObservableMessage(name);
      entry.prefix = this.calculatePrefix();
      register.set(name, entry);

      if (toAttribute != null) entry.toAttribute = toAttribute;
      if (toEvent != null) entry.toEvent = toEvent;
      if (isPreBinded != null) entry.isPreBinded = isPreBinded;
      if (letRepeat != null) entry.letRepeat = letRepeat;
    }

    return this;
  }

  /**
   * We have readed the binded information from attribute
   * such as on-event=[[controller:channel]].
   * If name was not previously defined is an system event, such as `on-click`
   *
   * @param {String} name
   * @param {String | Object} controller
   * @param {String} channel
   * @return {MessageManager}
   */
  defineBinded(name, controller, channel) {
    this.define(name, { toEvent: true });
    this.entry.controllerHandler = (typeof controller === 'string')
      ? AlgController.controllers.get(controller)
      : controller;
    this.entry.channel = channel;

    return this;

    // const register = this.register;
    // let entry = this.entry = register.get(name);

    // if (!entry) {
    //   this.register.set(name, entry = this.entry = new ObservableMessage(name));
    //   entry.toEvent = true;
    // }

    // if (typeof controller === 'string') {
    //   entry.controllerHandler = AlgController.controllers.get(controller);
    // } else {
    //   entry.controllerHandler = controller;
    // }
    // entry.channel = channel;

    // return this;
  }

  /**
   * Emits a message
   *
   * @param {String} name
   * @param {*} value
   * @return {MessageManager}
   */
  fire(name, value) {
    // this.entry = this.register.get(name);
    // if (!this.entry) { this.define(name); }
    // this.entry.update(value);

    this.get(name).update(value);

    return this;
  }

  /**
   * Assure an entry
   *
   * @param {String} name
   * @return {ObservableMessage}
   */
  get(name) {
    // if (this.register.has(name)) return this.register.get(name);

    // this.define(name);
    // return this.entry;

    this.entry = (this.register.has(name))
      ? this.register.get(name)
      : this.define(name).entry;
    return this.entry;
  }

  /**
   * Action on message fire
   *
   * @param {String} name
   * @param {Function} handler
   * @return {MessageManager}
   */
  on(name, handler) {
    if (handler == null) return this;

    // this.entry = this.get(name);
    // this.entry.observe(handler);

    this.get(name).observe(handler);

    return this;
  }

  /**
   * Propagates changes in events/attributes to messages
   *
   * @return {MessageManager}
   */
  subscribeTo() {
    let isEventManager = false;

    this.register.forEach((entry, key) => {
      const {toAttribute, toEvent} = entry;
      if (toEvent) {
        const name = (typeof toEvent === 'boolean') ? key : toEvent;
        this.target.eventManager.on(name, (value) => { entry.update(value); });
        isEventManager = true;
      } else if (toAttribute) {
        const name = (typeof toAttribute === 'boolean') ? key : toAttribute;
        this.target.attributeManager.onChange(name, (value) => { entry.update(value); });
      }
    });
    if (isEventManager) this.target.eventManager.subscribe();

    return this;
  }

  /**
   * Defines a transformer to set the value
   *
   * @param {Function} handler
   * @return {MessageManager}
   */
  transformer(handler) {
    this.entry.transformer = handler;
    return this;
  }

  /**
   * Function to calculate when fire the message
   * @param {Function} handler handler(value)
   * @return {MessageManager}
   */
  trigger(handler) {
    this.entry.trigger = handler;
    return this;
  }

  /**
   * For Prebinded definition, update controller/channel
   * @return {MessageManager}
   */
  updatePrebinded() {
    const {controller, id} = this.target;
    if (!controller || !id) return this;

    const controllerHandler = (typeof controller === 'string')
      ? AlgController.controllers.get(controller)
      : controller;

    this.register.forEach((entry, key) => {
      if (entry.isPreBinded) {
        entry.controllerHandler = controllerHandler;
        entry.channel = `${id}_${key}`.toUpperCase();
      }
    });

    return this;
  }
}

export { MessageManager };
